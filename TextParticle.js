
class TextParticle{
    constructor(x,y)
    {
        this.x = x ;
        this.y = y;
        this.size = 3;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = Math.random()*40 +5;
        this.theta=0;

    }
    draw()
    {
        ctx.fillStyle = "green";
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.size,0,2*Math.PI);
        ctx.closePath();
        ctx.fill();
    }
    update()
    {
        let r=0.2;
        this.x=this.x+r*Math.cos(this.theta)*5;
      

     
        this.theta+=0.1;
        let dx = mouse.x - this.x;
        let dy =mouse.y - this.y;
        let distance = Math.sqrt(dx*dx+dy*dy);
        let forceDirectionX = dx/distance;
        let forceDirectionY = dy/distance;
        let maxDistance = mouse.radius;
        let force = (maxDistance-distance)/(maxDistance);//0..1
        //kolama kant al masara aqsar kolama kant a niba akbar
        let directionX = forceDirectionX*force*this.density;
        let directionY = forceDirectionY*force*this.density;
        if(distance < mouse.radius)
        {
          this.x-=directionX;
          this.y-=directionY;
        }
        else 
        {
            if(this.x != this.baseX)
            {
                let dx = this.x -this.baseX;
                this.x-=dx/10;
            }
            if(this.y!=this.baseY)
            {
                let dy = this.y -this.baseY;
                this.y-=dy/10;
            }
        }
    }
}
