import { useState } from 'react';                                                                              
  import { trpc } from '../utils/trpc';                                                                          
                                                                                                                 
  export function Stays() {                                                                                      
    const [hotelName, setHotelName] = useState('Four Seasons');                                                  
    const [checkInDate, setCheckInDate] = useState('2026-12-15');                                                
    const [checkOutDate, setCheckOutDate] = useState('2026-12-20');                                              
    const [results, setResults] = useState<any[]>([]);                                                           
    const [loading, setLoading] = useState(false);                                                               
                                                                                                                 
    const searchHotels = async () => {                                                                           
      setLoading(true);                                                                                          
      try {                                                                                                      
        const data = await trpc.hotels.search.query({                                                            
          hotelName,                                                                                             
          checkInDate,                                                                                           
          checkOutDate,                                                                                          
        });                                                                                                      
        setResults(data);                                                                                        
      } catch (error) {                                                                                          
        console.error('Search error:', error);                                                                   
      }                                                                                                          
      setLoading(false);                                                                                         
    };                                                                                                           
                                                                                                                 
    return (                                                                                                     
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">                                     
        <div className="max-w-6xl mx-auto px-4 py-12">                                                           
          <h1 className="text-4xl font-bold mb-8 text-center">Search Hotels</h1>                                 
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">                                               
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">                                              
              <input type="text" placeholder="Hotel name" value={hotelName} onChange={(e) =>                     
setHotelName(e.target.value)} className="border rounded px-3 py-2" />                                            
              <input type="date" value={checkInDate} onChange={(e) => setCheckInDate(e.target.value)}            
className="border rounded px-3 py-2" />                                                                          
              <input type="date" value={checkOutDate} onChange={(e) => setCheckOutDate(e.target.value)}          
className="border rounded px-3 py-2" />                                                                          
              <button onClick={searchHotels} disabled={loading} className="bg-green-600 text-white rounded px-6  
py-2 hover:bg-green-700 disabled:bg-gray-400 col-span-2">{loading ? 'Searching...' : 'Search Hotels'}</button>   
            </div>                                                                                               
          </div>                                                                                                 
          {results.length > 0 && (                                                                               
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">                                              
              {results.map((hotel, idx) => (                                                                     
                <div key={idx} className="bg-white rounded-lg shadow p-6 border-l-4 border-green-600">           
                  <h3 className="font-bold text-lg">{hotel.name}</h3>                                            
                  <p className="text-gray-600">{hotel.area}</p>                                                  
                  <p className="text-sm text-gray-500">Rating: {hotel.rating} ⭐</p>                             
                  <p className="text-2xl font-bold text-green-600 mt-4">{hotel.price} {hotel.nights}</p>         
                  <button className="mt-4 w-full bg-green-600 text-white rounded py-2 hover:bg-green-700">Book   
Now</button>                                                                                                     
                </div>                                                                                           
              ))}                                                                                                
            </div>                                                                                               
          )}                                                                                                     
          {results.length === 0 && !loading && (                                                                 
            <div className="text-center text-gray-500">                                                          
              <p>Search for hotels to see results</p>                                                            
            </div>                                                                                               
          )}                                                                                                     
        </div>                                                                                                   
      </div>                                                                                                     
    );                                                                                                           
  }                                                                                                              
                                                                                                                 
  export default Stays;
