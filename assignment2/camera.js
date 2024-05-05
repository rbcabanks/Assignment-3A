class Camera {
  constructor(aspectRatio,near,far) {
    this.fov =60.0;
    this.eye=new Vector3([0,0,.5]);
    this.at=new Vector3([0,0,-1]);
    this.up=new Vector3([0,1,0]);
    

    this.updateView();
    this.projectionMatrix=new Matrix4();
    //this.projectionMatrix.setPerspective(this.fov,aspectRatio,near,far);
   
    this.viewMatrix=new Matrix4();
    this.viewMatrix.setLookAt(this.eye.elements[0],this.eye.elements[1],this.eye.elements[2],this.at.elements[0],this.at.elements[1],this.at.elements[2],this.up.elements[0],this.up.elements[1],this.up.elements[2]); //eye, at, up
    //gl.uniformMatrix4fv(u_ViewMatrix,false,this.viewMatrix.elements);

   //gl.uniformMatrix4fv(u_ProjectionMatrix,false,this.projectionMatrix.elements);


  }
  moveForward(){
    /*
    Compute forward vector f = at - eye. 
    Create a new vector f: let f = new Vector3();
    Set f to be equal to at: f.set(at);
    Subtract eye from f: f.sub(eye);
    Normalize f using f.normalize(); 
    Scale f by a desired "speed" value: f.mul(speed)
    Add forward vector to both eye and center: eye += f; at += f; 
    */
    console.log("k")
    var f= new Vector3();
    f.set(this.at);
    f.sub(this.eye);
    f.normalize();
    //f.mul(3);

    this.eye.add(f);
    this.at.add(f);
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