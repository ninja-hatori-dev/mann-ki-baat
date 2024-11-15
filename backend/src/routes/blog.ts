import { createBlogInput, updateBlogInput } from "@21uec027/mannkibaat-common";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify } from "hono/jwt";

export const blogRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
    },
    Variables: {
        userId: string
    }
}>();

blogRouter.use('/*',async (c, next) => {
    const jwt = c.req.header('Authorization');
     
	if (!jwt) {
		c.status(401);
		return c.json({ error: "unauthorized" });
	}
	const token = jwt.split(" ")[1];
	const payload = await verify(token, c.env.JWT_SECRET);
	if (!payload) {
		c.status(401);
		return c.json({ error: "unauthorized" });
	}
	c.set('userId', payload.id as string);
	await next()
});





blogRouter.post('/add', async (c) => {
	const userId = c.get('userId');
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());
    try{
        const body = await c.req.json();
        const { success } = createBlogInput.safeParse(body);
        if(! success){
            c.status(411);
            return c.json({
                message : "inputs syntax are incorrect"
            })
        }
        const post = await prisma.post.create({
            data: {
                title: body.title,
                content: body.content,
                authorId: userId
            }
        });
		
		console.log("koi dikkat nhi");
        return c.json({
            id: post.id
        });

		
    }
	catch(e){
        console.log(e);
    }
})

blogRouter.put('/up', async (c) => {
	const userId = c.get('userId');
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());

	const body = await c.req.json();

    const { success } = updateBlogInput.safeParse(body);

    if(! success){
        c.status(411);
        return c.json({
            message : "input syntax is incorrect"
        })
    }

	prisma.post.update({
		where: {
			id: body.id,
			authorId: userId
		},
		data: {
			title: body.title,
			content: body.content
		}
	});

	return c.text('updated post');
});


blogRouter.get('/bulk', async (c) => {
   try{
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());
	const excludedId = c.get('userId');
	
	const post = await prisma.post.findMany({
		where: {
            authorId: excludedId ? {
               not: excludedId, 
            } : undefined,
         },
		select:{
			content: true,
			title: true,
			id: true, 
			authorId: true,
			author: {
			   select:{
			   name: true
			
			}
		}
	}});

	return c.json(post);
   }
	catch(e){
		console.log(e)
	}
   
	
})

blogRouter.get('/:id', async (c) => {
	const id = c.req.param('id');
	 // 
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL	,
	}).$extends(withAccelerate());
	
	const post = await prisma.post.findUnique({
		where: {
			id
		},
		select:{
            id:true,
            title:true,
            content:true,
			authorId: true,
            author:{
                select:{
                    name:true
                }
            }
        }
	});

	return c.json(post);
})


blogRouter.delete("/:id", async (c) => {
	const id = c.req.param("id");
              
	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL,
	}).$extends(withAccelerate());

	try {
		
		const res = await prisma.post.delete({
			where: {
				id: id,
				authorId: c.get("userId")
			},
		});
		console.log(c.get("userId"));
		console.log(res);
		
		return c.json({
			message: "Post deleted successfully",
			
		});
	} catch (error) {
		console.log("Error: ", error);
		c.status(403);
		return c.json({
			message: "error",
		});
	}
});

blogRouter.get("/myaccount/:authorId", async(c)=>{

	const prisma = new PrismaClient({
		datasourceUrl: c.env?.DATABASE_URL,
	}).$extends(withAccelerate());
       
	try{ const authorId = c.req.param('authorId');

		// Fetch all posts for the specified authorId
		const posts = await prisma.post.findMany({
		   where: {
			  authorId: authorId, // Filter posts by authorId
		   },
		   select: {
			  content: true,
			  title: true,
			  id: true,
			  authorId: true,
			  author: {
				 select: {
					name: true,
				 },
			  },
		   },
		});
  
		// Return the posts as a JSON response
		return c.json(posts);
	 } catch (e) {
		console.error(e);
		return c.json({ error: 'Something went wrong' }, 500);
	 }
  });
