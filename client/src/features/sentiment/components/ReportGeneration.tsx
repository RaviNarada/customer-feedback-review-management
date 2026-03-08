type Props = {
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
};

const ReportGeneration = ({name,setName} : Props) => {
  
    


    const handleExport = async () => {
        const response = await fetch("http://localhost:5000/api/analysis/export",{
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
        
        const blob = await response.blob();

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "report.csv";
        document.body.appendChild(a);
        a.click();
        a.remove();
    };
  
  
    return (
    <div className="shadow-xl rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 ">
    <div className="pl-8 mt-3 ">
      <p className="text-xl  font-semibold text-white ">📄 Report Generator</p>
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
      <button onClick={handleExport} className="bg-purple-700 text-white px-3 py-3 rounded-xl 
                       hover:bg-indigo-500 active:scale-95 
                       transition duration-200 font-medium mt-3 shadow-md">download</button>
      </div>
      <br></br>
    
  </div>
  )
}

export default ReportGeneration
