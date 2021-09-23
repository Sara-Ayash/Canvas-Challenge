import { React, useRef, useEffect, useState } from "react";
import './style.css'
import { Button, Container, Row, Col } from 'react-bootstrap';

export default function Triangular() {

    var ctx;        // contain context for canvas 
    var canvasW;    // canvas width
    var canvasH;    // canvas length

    // Json object, contain all the triangulars
    const [triangulars, setTriangulars] = useState({ triangularSet: [] });

    // The global triangle 
    var triangular = {
        s: 150,     // length of each side
        h: 0,       // triangle height  
        locX: 50,   // x point location
        locY: 50,   // y point location
        ds: 0       // extra length to the side
    }

    // Contain referece to canvas board
    const canvasRef = useRef(null);

    // Draw triangular by value in triangular object
    // save is a boolean to know if save and initialize the global triangle
    const drawTriangular = (save = true) => {

        if (ctx === undefined) {
            return;
        }

        ctx.beginPath();
        ctx.moveTo(triangular.locX, triangular.locY);
        ctx.lineTo(triangular.s + triangular.locX, triangular.locY); // draw first side 
        
        // calculation of the height of the triangle according to Pythagoras' theorem
        triangular.h = Math.sqrt((triangular.s ** 2) - (triangular.s / 2) ** 2);
        ctx.lineTo(triangular.locX + triangular.s / 2, triangular.h + triangular.locY); // draw second side
        ctx.lineTo(triangular.locX, triangular.locY); // draw third side       
        ctx.stroke();

        if (save) {
            saveTriangular(); // save the detaile of current triangle drawn is json object
            setDefaultValue(); // initialize default value to global triangle
        }


    }

    // Draw default triangular in location: (50,50) each side in length: 150
    const drawDefaultTriangular = () => {

        triangular.s = 150;
        triangular.h = Math.sqrt((triangular.s ** 2) - (triangular.s / 2) ** 2);
        drawTriangular();
    }

    // While press on button the size of triangular bigger
    const changeSize = () => {
        clearCanvas();
        triangular.s = triangular.s + triangular.ds; // add length for triangular side
        
        // calculation of the height of the triangle according to Pythagoras' theorem
        triangular.h = Math.sqrt((triangular.s ** 2) - (triangular.s / 2) ** 2);  
        drawTriangular(false);
        if (triangular.ds === 0)
            return;
        requestAnimationFrame(changeSize);
    }

    // Draw triangular by press location
    const drawByLocation = (e) => {
        const tr = canvasRef.current.getBoundingClientRect();
        triangular.locX = e.clientX - tr.left;
        triangular.locY = e.clientY - tr.top;
        drawTriangular();
    }

    // Save triangular in json object
    const saveTriangular = () => {
        setTriangulars({ triangularSet: [...triangulars.triangularSet, triangular] });
    }

    // Initialize triangular default value
    const setDefaultValue = () => {
        triangular.s = 150;
        triangular.h = Math.sqrt((triangular.s ** 2) - (triangular.s / 2) ** 2);
    }

    // When mouse down the triangular bigger by add length for triangular side
    // the function changeSize() show animation of enlarging a triangle. 
    const onMouseDown = () => {
        triangular.ds = 1;
        changeSize();
    }

    // Update final triangular size
    const onMouseUp = () => {
        triangular.ds = 0;
        saveTriangular();
        drawTriangular(false);
        setTriangulars({ triangularSet: [...triangulars.triangularSet, triangular] });

        const arr = {
            triangularSet: [...triangulars.triangularSet, triangular]
        }

        drawAllLocalTriangulars(arr);
    }

    // Delete everything drawn on the board
    const clearCanvas = () => {
        if (canvasRef.current.getContext('2d') !== undefined)
            ctx.clearRect(0, 0, canvasW, canvasH);
    }

    // Delete the last triangle drawn
    const deleteLastTriangular = () => {
        if (triangulars.triangularSet === undefined) {
            debugger
            return;
        }
        const arr = {
            triangularSet: triangulars.triangularSet.slice(0, triangulars.triangularSet.length - 1)
        }
        clearCanvas();
        // redraw to the other triangles
        drawAllLocalTriangulars(arr);


    }

    // Save the json object that contain all triangles data in local storage
    const saveCanvas = (arr = triangulars) => {
        localStorage.setItem('trs', JSON.stringify(arr));
    }

    // Restore all triangles data from localStorage and draw them in canvas
    // localStorage document in this link: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
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

    // Draw each of the triangles stored in json object
    const drawAllLocalTriangulars = (arr) => {

        if (arr.triangularSet.length > 0) {
            arr.triangularSet.forEach(tr => {
                triangular = tr;
                drawTriangular(false);
            });
        }
        setTriangulars({ triangularSet: arr.triangularSet });


    }



    // useEffect function is performed as soon as the component renderer
    // it contains initializations to the critical variables 
    // the renderer happen for every change.
    useEffect(() => {
        const canvas = canvasRef.current;
        ctx = canvas.getContext('2d');
        canvasW = canvas.width;
        canvasH = canvas.height;

    });

    // This useEffect function will only be performed in the initial processing 
    useEffect(() => {
        const canvas = canvasRef.current;
        ctx = canvas.getContext('2d');
        if (ctx !== undefined)
            restoreCanvas();
    }, []);

    const style = { margin: '20px', display: 'inline' } // 

    return (
        <div>
            <Container>
                <Row>
                    <Col>
                        {/* 
                        Button for Step 1:
                        on Click on this button the function: drawDefaultTriangular() will be performed 
                        this function draw a new triangle. 
                        */}
                        <Button
                            style={style}
                            onClick={() => drawDefaultTriangular()}
                            variant="primary">Create Triangular
                        </Button>

                        {/* 
                        Button for Step 2: 
                        The function: onMouseDown() will be executed as long as the mouse is clicked
                        The function: onMouseUp() will be executed as soon as the click is completed
                        These functions draw a triangle that grows as long as the mouse is clicked.
                        */}
                        <Button
                            style={style}
                            onMouseDown={() => onMouseDown()}
                            onMouseUp={() => onMouseUp()}
                            variant="secondary">
                            Press and hold to create big triangular
                        </Button>

                        {/* 
                        Button for Step 4: 
                        on Click on this button the function: deleteLastTriangular() will be performed 
                        this function deletes the last drawn triangle.
                        */}
                        <Button
                            style={style}
                            onClick={() => deleteLastTriangular()}
                            variant="success">
                            Delete last triangular
                        </Button>

                        {/*  
                        Button for Step 5: 
                        on Click on this button the function: saveCanvas() will be performed 
                        this function stores in local storage all the triangles drawn on the screen. 
                        */}
                        <Button style={style}
                            onClick={() => saveCanvas()}
                            variant="warning">
                            Save Canvas
                        </Button>

                    </Col>
                    <Col>
                        {/* 
                        canvas is a board on which you can draw shapes and perform animations draw
                        In this program we will draw triangles on it.
                        */}
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