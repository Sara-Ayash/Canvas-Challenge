import { React, useRef, useEffect, useState } from "react";
import './style.css'
import { Button, Container, Row, Col } from 'react-bootstrap';

export default function Triangular() {
    var ctx;
    var canvasW;
    var canvasH;
    const [triangulars, setTriangulars] = useState({ triangularSet: [] });

    var triangular = {
        s: 150,
        h: 0,
        locX: 50,
        locY: 50,
        ds: 0
    }

    const canvasRef = useRef(null);

    // draw triangular by value in triangular object
    const drawTriangular = (save = true) => {
        if (ctx === undefined) {
            return;
        }
        ctx.beginPath();
        ctx.moveTo(triangular.locX, triangular.locY);
        ctx.lineTo(triangular.s + triangular.locX, triangular.locY); // first side 
        triangular.h = Math.sqrt((triangular.s ** 2) - (triangular.s / 2) ** 2);
        ctx.lineTo(triangular.locX + triangular.s / 2, triangular.h + triangular.locY); // second side
        ctx.lineTo(triangular.locX, triangular.locY); // third side       
        ctx.stroke();

        if (save) {
            saveTriangular();
            setDefaultValue();
        }


    }

    // draw default triangular in location: (50,50) each side in length: 150
    const drawDefaultTriangular = () => {

        triangular.s = 150;
        triangular.h = Math.sqrt((triangular.s ** 2) - (triangular.s / 2) ** 2);
        drawTriangular();
    }

    // while press on button the size of triangular bigger
    const changeSize = () => {
        clearCanvas();
        triangular.s = triangular.s + triangular.ds;
        triangular.h = Math.sqrt((triangular.s ** 2) - (triangular.s / 2) ** 2);
        drawTriangular(false);
        if (triangular.ds === 0)
            return;
        requestAnimationFrame(changeSize);
    }

    // draw triangular by press location
    const drawByLocation = (e) => {
        const tr = canvasRef.current.getBoundingClientRect();
        triangular.locX = e.clientX - tr.left;
        triangular.locY = e.clientY - tr.top;
        drawTriangular();
    }

    // save triangular in json object
    const saveTriangular = () => {
        setTriangulars({ triangularSet: [...triangulars.triangularSet, triangular] });
    }

    // initialize triangular default value
    const setDefaultValue = () => {
        triangular.s = 150;
        triangular.h = Math.sqrt((triangular.s ** 2) - (triangular.s / 2) ** 2);
    }

    // while mouse down the triangular bigger
    const onMouseDown = () => {
        triangular.ds = 1;
        changeSize();
    }

    // update final triangular size
    const onMouseUp = () => {
        triangular.ds = 0;
        saveFinalSize();


    }
    const saveFinalSize = () => {
        saveTriangular();
        drawTriangular(false);
        setTriangulars({ triangularSet: [...triangulars.triangularSet, triangular] });

        const arr = {
            triangularSet: [...triangulars.triangularSet, triangular]
        }
        
        drawAllLocalTriangulars(arr);
    }
    const clearCanvas = () => {
        if (canvasRef.current.getContext('2d') !== undefined)
            ctx.clearRect(0, 0, canvasW, canvasH);
    }

    // delete the last triangle drawn
    const deleteLastTriangular = () => {
        if (triangulars.triangularSet === undefined) {
            debugger
            return;
        }
        const arr = {
            triangularSet: triangulars.triangularSet.slice(0, triangulars.triangularSet.length - 1)
        }
        clearCanvas();
        drawAllLocalTriangulars(arr);


    }

    // save the json object that contain all triangles data in local storage
    const saveCanvas = (arr = triangulars) => {
        localStorage.setItem('trs', JSON.stringify(arr));
    }

    // restore all triangles data and draw them in canvas
    const restoreCanvas = () => {
        const arr = JSON.parse(localStorage.getItem('trs'));
        if (arr !== null) {
            setTriangulars({ triangularSet: arr.triangularSet });
            if (arr.triangularSet.length > 0) {

                arr.triangularSet.forEach(tr => {
                    triangular = tr;
                    drawTriangular(false);
                });
            }
        }
    }

    const drawAllLocalTriangulars = (arr) => {

        if (arr.triangularSet.length > 0) {
            arr.triangularSet.forEach(tr => {
                triangular = tr;
                drawTriangular(false);
            });
        }
        setTriangulars({ triangularSet: arr.triangularSet });


    }




    useEffect(() => {
        const canvas = canvasRef.current;
        ctx = canvas.getContext('2d');
        canvasW = canvas.width;
        canvasH = canvas.height;

    });

    useEffect(() => {
        const canvas = canvasRef.current;
        ctx = canvas.getContext('2d');
        if (ctx !== undefined)
            restoreCanvas();
    }, []);

    const style = { margin: '20px', display: 'inline' }

    return (
        <div>
            <Container>
                <Row>
                    <Col>
                        {/* step 1 */}
                        <Button
                            style={style}
                            onClick={() => drawDefaultTriangular()}
                            variant="primary">Create Triangular
                        </Button>

                        {/* step 2 */}
                        <Button
                            style={style}
                            onMouseDown={() => onMouseDown()}
                            onMouseUp={() => onMouseUp()}
                            variant="secondary">
                            Press and hold to create big triangular
                        </Button>

                        {/* step 4 */}
                        <Button
                            style={style}
                            onClick={() => deleteLastTriangular()}
                            variant="success">
                            Delete last triangular
                        </Button>

                        {/* step 5 */}
                        <Button style={style}
                            onClick={() => saveCanvas()}
                            variant="warning">
                            Save Canvas
                        </Button>

                    </Col>
                    <Col>
                        <canvas
                            id="canvas"
                            width="500"
                            height="500"
                            onClick={(e) => drawByLocation(e)}  //  this event for recognize press on canvas for step 3 
                            ref={canvasRef}></canvas>
                    </Col>
                </Row>
            </Container>

        </div>
    );
}