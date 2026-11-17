import { COOKIE_NAME } from "@shared/const";                                                                   
  import { getSessionCookieOptions } from "./_core/cookies";                                                     
  import { systemRouter } from "./_core/systemRouter";                                                           
  import { publicProcedure, router } from "./_core/trpc";                                                        
  import { z } from "zod";                                                                                       
                                                                                                                 
  // ADD THIS FLIGHT ROUTER                                                                                      
  export const flightRouter = router({                                                                           
    search: publicProcedure                                                                                      
      .input(z.object({                                                                                          
        from: z.string(),                                                                                        
        to: z.string(),                                                                                          
        departDate: z.string(),                                                                                  
        returnDate: z.string().optional(),                                                                       
        adults: z.number().default(1),                                                                           
      }))                                                                                                        
      .query(async ({ input }) => {                                                                              
        try {                                                                                                    
          const response = await fetch(                                                                          
            `https://api.apilayer.com/amadeus/flightSearch?apikey=cb00dc8a7d733a7668b2ab2e2388cff1`,             
            {                                                                                                    
              method: "POST",                                                                                    
              headers: { "Content-Type": "application/json" },                                                   
              body: JSON.stringify({                                                                             
                originCode: input.from,                                                                          
                destinationCode: input.to,                                                                       
                departureDate: input.departDate,                                                                 
                returnDate: input.returnDate,                                                                    
                adults: input.adults,                                                                            
              }),                                                                                                
            }                                                                                                    
          );                                                                                                     
                                                                                                                 
          const data = await response.json();                                                                    
          return data.data || [];                                                                                
        } catch (error) {                                                                                        
          console.error("Flight search error:", error);                                                          
          return [];                                                                                             
        }                                                                                                        
      }),                                                                                                        
  });                                                                                                            
                                                                                                                 
  export const appRouter = router({                                                                              
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with 
'/api/' so that the gateway can route correctly                                                                  
    system: systemRouter,                                                                                        
    flights: flightRouter,                                                                                       
    auth: router({                                                                                               
      me: publicProcedure.query(opts => opts.ctx.user),                                                          
      logout: publicProcedure.mutation(({ ctx }) => {                                                            
        const cookieOptions = getSessionCookieOptions(ctx.req);                                                  
        ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });                                      
        return {                                                                                                 
          success: true,                                                                                         
        } as const;                                                                                              
      }),                                                                                                        
    }),                                                                                                          
  });                                                                                                            
                                                                                                                 
  export type AppRouter = typeof appRouter;
