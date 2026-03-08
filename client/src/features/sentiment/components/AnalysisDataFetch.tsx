
import type { Props,SentimentCount,SetSentimentType} from './types';


const AnalysisDataFetch = ({name,setName,setSentimentArray} : Props & Pick<SetSentimentType,"setSentimentArray">) => {

    const handleImport = async () => {
      const response = await fetch("http://localhost:5000/api/analysis/sentiment",{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({name}),
        });
      
      if (!response.ok) {
      const errorData = await response.json();
      alert(errorData.message || "Something went wrong");
      return;
      }
      
      const data:SentimentCount[] = await response.json()

      console.log(data)

      setSentimentArray(data)

  }

  return (
    <>
      <div className="shadow-xl rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 ">
      <div className="pl-8 mt-3 ">
        <p className="text-xl  font-semibold text-white ">📄 Analysis Generator</p>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className=" w-11/12 mt-3 py-3 border border-gray-300 rounded-xl bg-gray-300 opacity-40
                        text-black focus:bg-white focus:outline-none focus:ring-2 
                        transition duration-200"
        />
      </div>
        <div className="flex justify-center ">
        <button onClick={handleImport} className="bg-purple-700 text-white px-3 py-3 rounded-xl 
                        hover:bg-indigo-500 active:scale-95 
                        transition duration-200 font-medium mt-3 shadow-md">show analysis</button>
        </div>
        <br></br>
      
    </div>
    </>
  )
}

export default AnalysisDataFetch
