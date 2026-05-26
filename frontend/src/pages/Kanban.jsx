import React,{
useEffect,
useState
} from "react";

import axios from "axios";

import {
useNavigate
}
from "react-router-dom";


const Kanban=()=>{

const[
tasks,
setTasks
]=useState({

todo:[],
in_progress:[],
review:[],
done:[]

});


const token=
localStorage.getItem(
"token"
);

const role=
localStorage.getItem(
"role"
);

const navigate=
useNavigate();


const fetchTasks=
async()=>{

try{

const res=
await axios.get(

"http://127.0.0.1:8000/tasks/kanban",

{
headers:{
Authorization:
`Bearer ${token}`
}
}

);

setTasks(
res.data||{}
);

}

catch(err){

console.log(
err
);

}

};


useEffect(()=>{

fetchTasks();

},[]);


// 🔥 LIVE KANBAN

useEffect(()=>{

const socket=
new WebSocket(

"ws://127.0.0.1:8000/ws/kanban"

);


socket.onopen=()=>{

console.log(
"Kanban Connected"
);

};


socket.onmessage=(event)=>{

const data=
JSON.parse(
event.data
);

if(
data.type==="kanban"
){

fetchTasks();

}

};


socket.onerror=()=>{

console.log(
"Websocket Error"
);

};


const ping=
setInterval(()=>{

if(
socket.readyState===1
){

socket.send(
"ping"
);

}

},30000);


return()=>{

clearInterval(
ping
);

socket.close();

};

},[]);


const updateStatus=
async(

taskId,
newStatus

)=>{

try{

await axios.patch(

`http://127.0.0.1:8000/tasks/${taskId}/status?status=${newStatus}`,

{},

{
headers:{
Authorization:
`Bearer ${token}`
}
}

);

}

catch{

alert(
"Update failed"
);

}

};


const deleteTask=
async(taskId)=>{

try{

await axios.delete(

`http://127.0.0.1:8000/tasks/${taskId}`,

{
headers:{
Authorization:
`Bearer ${token}`
}
}

);

fetchTasks();

}

catch{

alert(
"Delete failed"
);

}

};


const renderColumn=(

title,
key,
color

)=>(

<div

style={{

...styles.column,

borderTop:
`5px solid ${color}`

}}

>

<h2>

{title}

</h2>


{

(tasks[key]||[])

.map(task=>(

<div

key={task.id}

style={styles.card}

>

<h3>

{task.title}

</h3>

<p>

{task.description}

</p>


<div
style={styles.priority}
>

{task.priority}

</div>


<div
style={styles.btnArea}
>

{

key==="todo"

&&(

<button

style={
styles.blueBtn
}

onClick={()=>

updateStatus(

task.id,

"in_progress"

)

}

>

Start

</button>

)

}


{

key==="in_progress"

&&(

<button

style={
styles.orangeBtn
}

onClick={()=>

updateStatus(

task.id,

"review"

)

}

>

Review

</button>

)

}


{

key==="review"

&&(

<button

style={
styles.greenBtn
}

onClick={()=>

updateStatus(

task.id,

"done"

)

}

>

Done

</button>

)

}


{

role!=="employee"

&&(

<button

style={
styles.deleteBtn
}

onClick={()=>

deleteTask(

task.id

)

}

>

Delete

</button>

)

}


</div>

</div>

))

}

</div>

);


return(

<div
style={styles.container}
>

<div
style={styles.topBar}
>

<h1
style={styles.heading}
>

🚀 Enterprise Kanban

</h1>


<button

style={styles.dashboardBtn}

onClick={()=>

navigate(

"/dashboard"

)

}

>

Dashboard

</button>

</div>


<div
style={styles.board}
>

{

renderColumn(

"TODO",

"todo",

"#3b82f6"

)

}

{

renderColumn(

"PROGRESS",

"in_progress",

"#f59e0b"

)

}

{

renderColumn(

"REVIEW",

"review",

"#8b5cf6"

)

}

{

renderColumn(

"DONE",

"done",

"#10b981"

)

}

</div>

</div>

);

};


const styles={

container:{

padding:"25px",

minHeight:"100vh",

background:
"linear-gradient(135deg,#020617,#0f172a,#1e293b,#312e81)",

color:"#fff"

},

topBar:{

display:"flex",

justifyContent:"space-between",

alignItems:"center",

marginBottom:"30px"

},

heading:{

fontSize:"42px",

fontWeight:"bold"

},

dashboardBtn:{

background:
"linear-gradient(135deg,#2563eb,#7c3aed)",

padding:"12px 18px",

border:"none",

borderRadius:"12px",

color:"#fff",

fontWeight:"bold",

cursor:"pointer"

},

board:{

display:"grid",

gridTemplateColumns:
"repeat(4,1fr)",

gap:"20px"

},

column:{

background:
"rgba(255,255,255,0.08)",

backdropFilter:
"blur(12px)",

padding:"18px",

borderRadius:"18px",

minHeight:"650px"

},

card:{

background:"#fff",

color:"#000",

padding:"15px",

marginBottom:"15px",

borderRadius:"16px",

boxShadow:
"0 8px 18px rgba(0,0,0,0.25)"

},

priority:{

background:"#dbeafe",

padding:"6px",

borderRadius:"8px",

display:"inline-block",

marginBottom:"10px"

},

btnArea:{

display:"flex",

gap:"8px",

flexWrap:"wrap"

},

blueBtn:{

background:"#2563eb",

color:"#fff",

border:"none",

padding:"8px",

borderRadius:"8px"

},

orangeBtn:{

background:"#f59e0b",

color:"#fff",

border:"none",

padding:"8px",

borderRadius:"8px"

},

greenBtn:{

background:"#10b981",

color:"#fff",

border:"none",

padding:"8px",

borderRadius:"8px"

},

deleteBtn:{

background:"#dc2626",

color:"#fff",

border:"none",

padding:"8px",

borderRadius:"8px"

}

};


export default Kanban;