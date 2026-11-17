import { useState } from 'react';                                                                              
  import { trpc } from '../utils/trpc';                                                                          
                                                                                                                 
  export function Flights() {                                                                                    
    const [from, setFrom] = useState('JFK');                                                                     
    const [to, setTo] = useState('LAX');                                                                         
    const [departDate, setDepartDate] = useState('2026-12-15');                                                  
    const [adults, setAdults] = useState(1);                                                                     
    const [results, setResults] = useState<any[]>([]);                                                           
    const [loading, setLoading] = useState(false);                                                               
                                                                                                                 
    const searchFlights = async () => {                                                                          
      setLoading(true);                                                                                          
      try {                                                                                                      
        const data = await trpc.flights.search.query({                                                           
          from,                                                                                                  
          to,                                                                                                    
          departDate,                                                                                            
          adults,                                                                                                
          children: 0,                                                                                           
          infants: 0,                                                                                            
          cabin: 'Economy',                                                                                      
          currency: 'USD',                                                                                       
        });                                                                                                      
        setResults(data);                                                                                        
      } catch (error) {                                                                                          
        console.error('Search error:', error);                                                                   
      }                                                                                                          
      setLoading(false);                                                                                         
    };                                                                                                           
                                                                                                                 
    return (                                                                                                     
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">                                      
        <div className="max-w-6xl mx-auto px-4 py-12">                                                           
          <h1 className="text-4xl font-bold mb-8 text-center">Search Flights</h1>                                
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">                                               
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">                                              
              <input type="text" placeholder="From (e.g., JFK)" value={from} onChange={(e) =>                    
setFrom(e.target.value)} className="border rounded px-3 py-2" />                                                 
              <input type="text" placeholder="To (e.g., LAX)" value={to} onChange={(e) => setTo(e.target.value)} 
className="border rounded px-3 py-2" />                                                                          
              <input type="date" value={departDate} onChange={(e) => setDepartDate(e.target.value)}              
className="border rounded px-3 py-2" />                                                                          
              <input type="number" min="1" max="9" value={adults} onChange={(e) =>                               
setAdults(parseInt(e.target.value))} className="border rounded px-3 py-2" placeholder="Adults" />                
              <button onClick={searchFlights} disabled={loading} className="bg-blue-600 text-white rounded px-6  
py-2 hover:bg-blue-700 disabled:bg-gray-400">{loading ? 'Searching...' : 'Search'}</button>                      
            </div>                                                                                               
          </div>                                                                                                 
          {results.length > 0 && (                                                                               
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">                                              
              {results.map((flight, idx) => (                                                                    
                <div key={idx} className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-600">            
                  <h3 className="font-bold text-lg">{flight.airline}</h3>                                        
                  <p className="text-gray-600">{flight.route}</p>                                                
                  <p className="text-sm text-gray-500">Time: {flight.time} | Duration: {flight.duration}</p>     
                  <p className="text-2xl font-bold text-blue-600 mt-4">{flight.price}</p>                        
                  <button className="mt-4 w-full bg-blue-600 text-white rounded py-2 hover:bg-blue-700">Select   
Flight</button>                                                                                                  
                </div>                                                                                           
              ))}                                                                                                
            </div>                                                                                               
          )}                                                                                                     
          {results.length === 0 && !loading && (                                                                 
            <div className="text-center text-gray-500">                                                          
              <p>Search for flights to see results</p>                                                           
            </div>                                                                                               
          )}                                                                                                     
        </div>                                                                                                   
      </div>                                                                                                     
    );                                                                                                           
  }                                                                                                              
                                                                                                                 
  export default Flights;
