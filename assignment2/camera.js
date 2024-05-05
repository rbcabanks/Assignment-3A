class Camera {
  constructor(aspectRatio,near,far) {
    this.fov =60.0;
    this.eye=new Vector3([0,0,1.4]);
    this.at=new Vector3([0,0,-1]);
    this.up=new Vector3([0,1,0]);

    //this.updateView();
    this.projectionMatrix=new Matrix4();
    this.projectionMatrix.setPerspective(this.fov,aspectRatio,near,far);
    //this.projectionMatrix.setPerspective(174,1,.1,1000);
    
    gl.uniformMatrix4fv(u_ProjectionMatrix,false,this.projectionMatrix.elements);

    this.viewMatrix=new Matrix4();
    this.viewMatrix.setLookAt(this.eye.elements[0],this.eye.elements[1],this.eye.elements[2],this.at.elements[0],this.at.elements[1],this.at.elements[2],this.up.elements[0],this.up.elements[1],this.up.elements[2]); //eye, at, up
    //gl.uniformMatrix4fv(u_ViewMatrix,false,this.viewMatrix.elements);

   //gl.uniformMatrix4fv(u_ProjectionMatrix,false,this.projectionMatrix.elements);
    gl.uniformMatrix4fv(u_ViewMatrix,false,this.viewMatrix.elements);

  }
  moveForward(){
    console.log("k")
    console.log("at",this.at);
    var f= new Vector3();
    f=this.at;
    console.log("f",f);
    //f.set(this.at);
    console.log("eye",this.eye);
    f.sub(this.eye);
  

    console.log("sub f",f);
   
    f.normalize();
    console.log("norm f",f);
    f.mul(3);
    console.log("mult f",f);

    this.eye.add(f);
    console.log("eye",this.eye);
    this.at.add(f);
    console.log("at",this.at);
    
  }
  moveBackward(){
    /*
      var f= new Vector3();
      f.set(this.eye);
      f.sub(this.at);
      f.normalize();
      f.mul(3);

      this.eye.add(f);
      this.at.add(f);
      console.log(this.at);*/
    console.log("S");
    this.eye.elements[0]+=.01;
  }
  moveLeft(){

  }
  moveRight(){

  }
  panLeft(){
  
  }
  panRight(){

  }

    
  
/*
*/
}