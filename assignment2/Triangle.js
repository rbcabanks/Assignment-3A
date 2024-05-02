
class Triangle {
    constructor() {
      this.type = 'triangle';
      this.position = [0.0, 0.0, 0.0, 0.0];
      this.color = [1.0, 1.0, 1.0, 1.0];
      this.size = 5.0;
      this.widthk=g_width;
      this.heightk=g_height;
      this.fliph=g_fliph;
      this.flipv=g_flipv;
      this.eql=g_eql;
    }
    // rendering function... originally was in colorpoints render function
    render(){
        var xy = this.position;
        var rgba = this.color;
        var size = this.size;

        // Pass the position of a point to a_Position variable
        //gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
        
        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        gl.uniform1f(u_Size, size);

        
        var w=(parseFloat(this.size/200.0)+parseFloat(this.widthk/200));
        var h=(parseFloat(this.size/200.0)+parseFloat(this.heightk/200));

        var d = this.size/200.0;
        var k=d-d/3+(this.widthk/200);

        // Draw
        //gl.drawArrays(gl.POINTS, 0, 1);
        if(this.eql==true){
          if(this.fliph==true){
            drawTriangle([xy[0],xy[1],xy[0]+k,xy[1],xy[0],xy[1]+h])
            drawTriangle([xy[0],xy[1],xy[0]-k,xy[1],xy[0],xy[1]+h])
          }
          else{
            drawTriangle([xy[0],xy[1],xy[0]+k,xy[1],xy[0],xy[1]-h])
            drawTriangle([xy[0],xy[1],xy[0]-k,xy[1],xy[0],xy[1]-h])
          }
        }
        else{
          if(this.fliph==true){
            if(this.flipv==true){
              drawTriangle([xy[0],xy[1],xy[0]+w,xy[1],xy[0],xy[1]+h])
            }
            else{
              drawTriangle([xy[0],xy[1],xy[0]-w,xy[1],xy[0],xy[1]+h]);
            }
          }
          else{
            if(this.flipv==true){
              drawTriangle([xy[0],xy[1],xy[0]+w,xy[1],xy[0],xy[1]-h])
            }
            else{
              drawTriangle([xy[0],xy[1],xy[0]-w,xy[1],xy[0],xy[1]-h]);
            }
          }
        }
        
        
      
        //drawTriangle([xy[0],xy[1],xy[0]+w,xy[1],xy[0],xy[1]+h])
        //drawTriangle([xy[0],xy[1],xy[0]-w,xy[1],xy[0],xy[1]+h])

      }
}
function drawTriangle(vertices) {
    var n = 3 // number of vertices
  
    // creating buffer object
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }
    // bind the buffer object to the target
    gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer);
    // write date into buffer object
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices),gl.DYNAMIC_DRAW);
  
    var a_Position = gl.getAttribLocation(gl.program,'a_Position');
    if(a_Position<0){
      console.log('Failed to get the storage location of a_Position');
      return -1;
    }
    //Assign buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position,2,gl.FLOAT,false,0,0);
    
    //Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);

    gl.drawArrays(gl.TRIANGLES,0,n);
  }

  function drawTriangle3D(vertices) {
    var n = 3 // number of vertices
  
    // creating buffer object
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }
    // bind the buffer object to the target
    gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer);
    // write date into buffer object
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices),gl.DYNAMIC_DRAW);
  
    var a_Position = gl.getAttribLocation(gl.program,'a_Position');
    if(a_Position<0){
      console.log('Failed to get the storage location of a_Position');
      return -1;
    }
    //Assign buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position,3,gl.FLOAT,false,0,0);
    
    //Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);

    gl.drawArrays(gl.TRIANGLES,0,n);
  }

  function drawTriangle3DUV(vertices, uv) {
    var n = 3 // number of vertices
  
    // creating buffer object
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }
    // bind the buffer object to the target
    gl.bindBuffer(gl.ARRAY_BUFFER,vertexBuffer);
    // write date into buffer object
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices),gl.DYNAMIC_DRAW);
  
    var a_Position = gl.getAttribLocation(gl.program,'a_Position');
    if(a_Position<0){
      console.log('Failed to get the storage location of a_Position');
      return -1;
    }
    //Assign buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position,3,gl.FLOAT,false,0,0);
    
    //Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);

    var uvBuffer=gl.createBuffer();
    if(!uvBuffer){
      console.log('Failed to create the buffer object');
      return -1;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER,uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv),gl.DYNAMIC_DRAW);
    gl.vertexAttribPointer(a_UV,2,gl.FLOAT,false,0,0);
    gl.enableVertexAttribArray(a_UV);
    gl.drawArrays(gl.TRIANGLES,0,n);
  }