class ImageParticle
{
    constructor(x,y,color,size=2)
    {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = 2;
        this.baseX = x;
        this.baseY = y;
        this.desity = Math.random()*40 +5;
        this.theta=0;

    }
    draw()
    {
       ctx.beginPath();
       ctx.arc(this.x,this.y,this.size,0,Math.PI*2);
       ctx.closePath();
       ctx.fill();
    }
   
    update()
    {
      
        this.x=this.x+Math.random()*2;
        let r=0.2;
        this.x=this.x+r*Math.cos(this.theta)*5;
        this.y=this.y-r*Math.sin(this.theta)*5;

     
        this.theta+=0.1;
        ctx.fillStyle = this.color;
        //collision detection
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx*dx+dy*dy);
        let forceDirectionX = dx/distance;
        let forceDirectionY = dy/distance;
        
        let maxDistance = 100;
        let force = 1-(distance-0)/(maxDistance-0);
        
        let directionX = forceDirectionX*force*this.desity;
        let directionY = forceDirectionY*force*this.desity;

        if(distance <mouse.radius + this.size)
        {
            this.x -= directionX;
            this.y -= directionY;
        }
        else 
        {
            if(this.x != this.baseX)
            {
                let dx = this.x - this.baseX;
                let dy = this.y - this.baseY;
             
                if(this.x != this.baseX)
                {
                    this.x-=dx/10;
                }
                if(this.y != this.baseY)
                {
                    this.y-=dy/10;
                }

            }
            this.draw();
        }






        
    }
}
