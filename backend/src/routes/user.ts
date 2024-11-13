import { Hono } from "hono";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign, verify } from 'hono/jwt'
import bcrypt from 'bcryptjs';

import { signupInput, signinInput } from "@21uec027/mankibaat-common";

export const userRouter = new Hono<{

    Bindings: {
    DATABASE_URL: string,
    JWT_SECRET : string
    }

}>();
 
interface SignupBody {
    email: string;
    password: string;
    name: string
  }

  
 
userRouter.post('/signup', async (c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());
  
    const body: SignupBody = await c.req.json();
    
    console.log("Request body:", body);
    const result = signupInput.safeParse(body);  
    if (!result.success) {
         
      c.status(411);
      return c.json({
          message: "Input syntax error",
          
      });
  }
  
    try {

      const hashedPassword = await bcrypt.hash(body.password, 10);

      const user = await prisma.user.create({
        data: {
          email: body.email,
          name: body.name,
          password: hashedPassword
        }
      });
      
      
      const token = await sign({ id: user.id , name: user.name}, c.env.JWT_SECRET);
  
      return c.json({
        jwt: token
      });
    } catch (e) {
      console.log(e);
      return c.status(403);
    }
  });
  



  

  userRouter.post('/signin', async (c) => {
    const prisma = new PrismaClient({
    
        datasourceUrl: c.env?.DATABASE_URL	,
    }).$extends(withAccelerate());

    const body = await c.req.json();

    const { success } = signinInput.safeParse(body);
    if(! success){
        c.status(411);
        return c.json({
            message : "inputs syntax are incorrect"
        })
    }



    const user = await prisma.user.findUnique({
        where: {
            email: body.email           
          }
    });
    
    if (!user) {
      c.status(403);
      return c.json({ error: "user not found or incorrect email" });
  }

   const dbpass = user?.password;
   const ismatch = await bcrypt.compare( body.password,dbpass)
  if (!ismatch ){
    return c.json({
     error: "incorrect password"
    })
  }
    
   

    

    const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
    return c.json({ jwt });
})

