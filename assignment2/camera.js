class Camera {
    constructor(aspectRatio,near,far) {
      this.fov =60.0;
      this.eye=new Vector3([0,0,0]);
      this.at=new Vector3([0,0,-1]);
      this.up=new Vector3([0,1,0]);
      
      this.viewMatrix=new Matrix4();
      //this.viewMatrix.setLookAt(this.eye.elements[0],this.eye.elements[1],this.eye.elements[2],this.at.elements[0],this.at.elements[1],this.at.elements[2],this.up[0],this.up[1],this.up[2]); //eye, at, up
      gl.uniformMatrix4fv(u_ViewMatrix,false,this.viewMatrix.elements);

      this.updateView();
      this.projectionMatrix=new Matrix4();
      //this.projectionMatrix.setPerspective(60,aspectRatio,near,far);
      gl.uniformMatrix4fv(u_ProjectionMatrix,false,this.projectionMatrix.elements);




    }
    moveForward(){

    }
    moveBackward(){
        
    }
    moveLeft(){

    }
    moveRight(){

    }
    panLeft(){
    
    }
    panRight(){

    }
    updateView(){

    }

      
    
  /*
  */
}