class Camera {
    constructor(aspectRatio,near,far) {
      this.fov =60;
      this.eye=new Vector3([0.,0.,1.]);
      this.at=new Vector3([0.,0.,5.]);
      this.up=new Vector3([0.,1.,0.]);

      /*this.eye=new Vector3([0.,0,1.]);
      this.at=new Vector3([0.,0.,-1.]);
      this.up=new Vector3([0.,1.,0.]);
      */
      this.viewMatrix=new Matrix4();
      this.viewMatrix.setLookAt(this.eye.elements[0],this.eye.elements[1],this.eye.elements[2],this.at.elements[0],this.at.elements[1],this.at.elements[2],this.up.elements[0],this.up.elements[1],this.up.elements[2]); //eye, at, up

      this.updateView();
      
      this.projectionMatrix=new Matrix4();
      this.projectionMatrix.setPerspective(this.fov,aspectRatio,near,far);


    }
    moveForward(){
      console.log("k")
      var f= this.at.subtract(this.eye);
      //eye.elements[0]+=.01;
      this.eye.elements[0]+=.01;
      this.updateView();
    }
    moveBackward(){
      this.eye.elements[0]-=.01;
      this.updateView();
    }
    moveLeft(){
      this.eye.elements[2]+=.01;
      this.updateView();
    }
    moveRight(){
      this.eye.elements[2]-=.01;
      this.updateView();
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