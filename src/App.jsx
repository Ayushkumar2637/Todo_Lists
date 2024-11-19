import { useState, useEffect, useRef } from "react";
import Footer from "./Components/Footer"
import Navbar from "./Components/Navbar"
import './Utitity/Utilities.css';
import { v4 as uuidv4 } from 'uuid';
import { FaEdit } from "react-icons/fa";
import { AiOutlineDelete } from "react-icons/ai";

function App() {

  const [input, setInput] = useState("");
  const [arr, setArr] = useState([]);
  const [show, setShow] = useState(false);

  // Method use for saving in local storage.
  const saveToLOS = (updatedTodos) => {
    localStorage.setItem("todos",JSON.stringify(updatedTodos));
  }

  // Method to load arr/todos in 1st rendering.
  useEffect(() => {
    let todoString = localStorage.getItem("todos");
      if(todoString!==null){
        let localTodo=JSON.parse(localStorage.getItem("todos"));
        setArr(localTodo);
      }
  }, [])
  

  const handleOnChange = (e) => {
    setInput(e.target.value);
  }

  // Below method helps enter key to execute handleSave() method.
  useEffect(() => {
    function handleOnKeyDown(e) {
      if (e.key === "Enter") {
        handleSave();
      }
    }
    window.addEventListener("keydown", handleOnKeyDown)
    return () => {
      window.removeEventListener("keydown", handleOnKeyDown)
    }
  }, [input])

  const handleSave = () => {
    let inputs = input.trim();

    if (inputs.length >= 3) {
      let updatedTodos=[...arr, { id: uuidv4(), inputs, isCompleted: false }]
      setArr(updatedTodos);
      saveToLOS(updatedTodos);

      // If we directly setArr with the updated value and also call saveToLOS() and operate saveToLOS with arr assuming values in arr is also updated [localStorage.setItem("todos",JSON.stringify(arr))] , but this would not work , arr at the time of saving to local storage have the old value of arr.
      // THATS WHY it is imp we make sure localstorage get the updated value with the help of a local variable . [ updatedTodos is local variable for the above code. ]

      // CHATGPT THOUGHT : Your current implementation has a common issue: the saveToLOS() function uses arr directly, but the arr state is updated asynchronously when calling setArr. Because state updates in React are not immediately reflected during the same function execution, the saveToLOS function ends up saving the old state of arr to local storage instead of the updated one.

      // setArr([...arr, { id: uuidv4(), inputs, isCompleted: false }]);
      // saveToLOS();
    }
    setInput("");
  }

  // const handleSave = () => {

  // //  i have trimed input and save it in val
  //   let val=input.trim();

  // //  i found val is trimed
  //   console.log(val.length);

  // //  i have try to setInput with val but this is not working bcoz in the next code when i checked input length so it is showing prev length and also inside arr prev input value is saved don't know why below line is not executing.
  // //  As per my understaing it happens bcoz of async nature of js - but how ? : Explaination in above function.

  //   setInput(val);

  //   if(input.length>3){
  //   setArr([...arr, { id: uuidv4(), input ,isCompleted:false}]);
  //   }
  //   setInput("");    
  //   console.log(arr);
  // }

  const handleEdit = (id) => {
    // Searching for the value
    let value = arr.filter((item) => {
      return id === item.id
    })
    setInput(value[0].inputs);

    // Delete form current list
    let newarr = arr.filter((item) => {
      return id !== item.id
    })
    setArr(newarr);
    saveToLOS(newarr);
  }

  const handleDelete = (id) => {
    if (confirm("Do you want to delete the value")) {
      let newarr = arr.filter((item) => {
        return id !== item.id
      })
      setArr(newarr);
      saveToLOS(newarr);
    }
  }

  const handleCheck = (id) => {
    let newarr = [...arr]
    let value = newarr.find((item) => {
      return item.id === id;
    })
    value.isCompleted = !value.isCompleted;
    setArr(newarr);
    saveToLOS(newarr);
  }

  const toggleShow = () => {
    setShow(!show);
  }


  return (
    <>
      <Navbar />
      <div className="container">
        <h1>TODO LISTS</h1>
        <div className="inputArea flex">
          <input placeholder="Enter TODO" onChange={handleOnChange} value={input} type="text" />
          <button className="buttonDesign" onClick={handleSave} disabled={input.length < 3}>Save</button>
        </div>
        <div className="sepration"></div>
        <div className="displayTodo">
          <h2>YOUR TODO'S</h2>
          <div className="save flex">
            <input onChange={toggleShow} type="checkbox" checked={show} />
            <div>Show All</div>
          </div>

          {arr.length==0 && <div>Currently no todos available</div>}

          {
            arr.map((item) => {
              return (show || item.isCompleted === false) && (<div key={item.id} className="flex todos">
                <div className="flex cont1">
                  <input onChange={() => { handleCheck(item.id) }} type="checkbox" checked={item.isCompleted} />
                  <span className={item.isCompleted ? "lineThrough" : "notLineThrough"} >{item.inputs}</span>
                </div>
                <div className="flex cont2">
                  <button onClick={() => { handleEdit(item.id) }}><FaEdit /></button>
                  <button onClick={() => { handleDelete(item.id) }}><AiOutlineDelete /></button>
                </div>
              </div>
              )
            })
          }
        </div>
      </div>
      <Footer />
    </>
  )
}
export default App
