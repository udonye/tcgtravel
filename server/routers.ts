import { COOKIE_NAME } from "@shared/const";                                                                   
  import { getSessionCookieOptions } from "./_core/cookies";                                                     
  import { systemRouter } from "./_core/systemRouter";                                                           
  import { publicProcedure, router } from "./_core/trpc";                                                        
  import { z } from "zod";                                                                                       
                                                                                                                 
  export const flightRouter = router({                                                                           
    search: publicProcedure                                                                                      
      .input(z.object({                                                                                          
        from: z.string(),                                                                                        
        to: z.string(),                                                                                          
        departDate: z.string(),                                                                                  
        returnDate: z.string().optional(),                                                                       
        adults: z.number().default(1),                                                                           
        children: z.number().default(0),                                                                         
        infants: z.number().default(0),                                                                          
        cabin: z.string().default("Economy"),                                                                    
        currency: z.string().default("USD"),                                                                     
      }))                                                                                                        
      .query(async ({ input }) => {                                                                              
        try {                                                                                                    
          const apiKey = process.env.FLIGHTAPI_KEY || "";                                                                                  
          const url =                                                                                            
`https://api.flightapi.io/onewaytrip/${apiKey}/${input.from}/${input.to}/${input.departDate}/${input.adults}/${in
put.children}/${input.infants}/${input.cabin}/${input.currency}`;                                                
          const response = await fetch(url);                                                                     
          const data = await response.json();                                                                    
          if (!data.best) return [];                                                                             
          return data.best.map((flight: any) => ({                                                               
            airline: flight.airline || "Unknown Airline",                                                        
            mark: flight.airline?.substring(0, 2).toUpperCase() || "AA",                                         
            route: `${input.from} → ${input.to}`,                                                                
            time: flight.departure_time || "N/A",                                                                
            duration: flight.duration || "N/A",                                                                  
            price: `$${flight.price}`,                                                                           
            badge: "Best price",                                                                                 
            color: "blue",                                                                                       
          })).slice(0, 5);                                                                                       
        } catch (error) {                                                                                        
          console.error("Flight search error:", error);                                                          
          return [];                                                                                             
        }                                                                                                        
      }),                                                                                                        
  });                                                                                                            
                                                                                                                 
  export const hotelRouter = router({                                                                            
    search: publicProcedure                                                                                      
      .input(z.object({                                                                                          
        hotelName: z.string(),                                                                                   
        checkInDate: z.string().optional(),                                                                      
        checkOutDate: z.string().optional(),                                                                     
      }))                                                                                                        
      .query(async ({ input }) => {                                                                              
        try {                                                                                                    
          const response = await                                                                                 
fetch(`https://api.stayapi.com/v1/meta/search?hotel_name=${encodeURIComponent(input.hotelName)}`, {              
            headers: {                                                                                           
              'x-api-key': process.env.STAYAPI_KEY || "",                                                                                
            },                                                                                                   
          });                                                                                                    
          const data = await response.json();                                                                    
          if (!data.data) return [];                                                                             
          return [{                                                                                              
            name: data.data.hotel_name,                                                                          
            area: data.data.location || "Location",                                                              
            rating: "4.8",                                                                                       
            price: "$285",                                                                                       
            nights: "per night",                                                                                 
            image: "/images/cabin.webp",                                                                         
            tag: "Available",                                                                                    
          }];                                                                                                    
        } catch (error) {                                                                                        
          console.error("Hotel search error:", error);                                                           
          return [];                                                                                             
        }                                                                                                        
      }),                                                                                                        
  });                                                                                                            
                                                                                                                 
  export const appRouter = router({                                                                              
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with 
'/api/' so that the gateway can route correctly                                                                  
    system: systemRouter,                                                                                        
    flights: flightRouter,                                                                                       
    hotels: hotelRouter,                                                                                         
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
