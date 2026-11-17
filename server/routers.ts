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
          const apiKey = "6afbb3046b6b5e2f0dfe3978";                                                             
                                                                                                                 
          // Build FlightAPI.io URL                                                                              
          const url =                                                                                            
`https://api.flightapi.io/onewaytrip/${apiKey}/${input.from}/${input.to}/${input.departDate}/${input.adults}/${in
put.children}/${input.infants}/${input.cabin}/${input.currency}`;                                                
                                                                                                                 
          const response = await fetch(url);                                                                     
          const data = await response.json();                                                                    
                                                                                                                 
          if (!data.best) return [];                                                                             
                                                                                                                 
          // Transform FlightAPI format to our format                                                            
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