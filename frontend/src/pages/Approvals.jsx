import React,{useEffect,useState} from "react";
import axios from "axios";

const Approvals=()=>{

const[approvals,setApprovals]=useState([]);
const[filter,setFilter]=useState("all");
const[history,setHistory]=useState(null);

const[title,setTitle]=useState("");
const[description,setDescription]=useState("");

const token=localStorage.getItem("token");
const role=localStorage.getItem("role");

useEffect(()=>{

fetchApprovals();

},[]);

const fetchApprovals=async()=>{

try{

const res=await axios.get(

"http://127.0.0.1:8000/approvals/",

{

headers:{

Authorization:

`Bearer ${token}`

}

}

);

setApprovals(

res.data||[]

);

}

catch(err){

console.log(err);

}

};

const handleCreate=async()=>{

if(!title||!description){

alert("Fill all fields");

return;

}

try{

await axios.post(

"http://127.0.0.1:8000/approvals/",

{

title,

description

},

{

headers:{

Authorization:

`Bearer ${token}`

}

}

);

setTitle("");

setDescription("");

fetchApprovals();

}

catch{

alert(

"Request failed"

);

}

};

const handleAction=async(

id,

action

)=>{

try{

await axios.patch(

`http://127.0.0.1:8000/approvals/${id}/action`,

{

action,

comment:

action==="rejected"

?

"Rejected"

:

""

},

{

headers:{

Authorization:

`Bearer ${token}`

}

}

);

fetchApprovals();

}

catch{

alert(

"Action failed"

);

}

};

const fetchHistory=async(id)=>{

try{

const res=

await axios.get(

`http://127.0.0.1:8000/approvals/${id}/history`,

{

headers:{

Authorization:

`Bearer ${token}`

}

}

);

setHistory(

res.data

);

}

catch{

alert(

"History failed"

);

}

};

const filtered=

filter==="all"

?

approvals

:

approvals.filter(

x=>x.status===filter

);

return(

<div style={styles.container}>

<h1 style={styles.title}>

Approval Workflow

</h1>

<p>

Role :

<b>

{role}

</b>

</p>

{

role==="employee"

&&

<div style={styles.formBox}>

<h3>

Create Request

</h3>

<input

style={styles.input}

placeholder="Title"

value={title}

onChange={(e)=>

setTitle(

e.target.value

)

}

/>

<textarea

style={styles.textarea}

placeholder="Description"

value={description}

onChange={(e)=>

setDescription(

e.target.value

)

}

/>

<button

style={styles.createBtn}

onClick={handleCreate}

>

Submit Request

</button>

</div>

}

<div style={styles.filterBar}>

{

["all",

"pending",

"approved",

"rejected"]

.map(

f=>

<button

key={f}

style={{

...styles.filterBtn,

background:

filter===f

?

"#2563eb"

:

"#334155"

}}

onClick={()=>

setFilter(f)

}

>

{f}

</button>

)

}

</div>

<div style={styles.grid}>

{

filtered.map(

a=>

<div

key={a.id}

style={styles.card}

>

<h3>

{a.title}

</h3>

<p>

{a.description}

</p>

<div

style={

getStatusStyle(

a.status

)

}

>

{a.status}

</div>

<div style={styles.actions}>

{

a.status==="pending"

&&

(

role==="manager"

||

role==="admin"

)

&&

<>

<button

style={styles.approveBtn}

onClick={()=>

handleAction(

a.id,

"approved"

)

}

>

Approve

</button>

<button

style={styles.rejectBtn}

onClick={()=>

handleAction(

a.id,

"rejected"

)

}

>

Reject

</button>

</>

}

{

(

role==="manager"

||

role==="admin"

)

&&

<button

style={styles.historyBtn}

onClick={()=>

fetchHistory(

a.id

)

}

>

History

</button>

}

</div>

</div>

)

}

</div>

{

history&&

<div style={styles.modalOverlay}>

<div style={styles.modal}>

<h2>

History

</h2>

{

history.map(

(h,i)=>

<p key={i}>

{h.action}

</p>

)

}

<button

style={styles.createBtn}

onClick={()=>

setHistory(

null

)

}

>

Close

</button>

</div>

</div>

}

</div>

);

};

const styles={

container:{

minHeight:"100vh",

padding:"40px",

background:

"linear-gradient(135deg,#0f172a,#1e293b,#111827)",

color:"#fff",

fontFamily:"Segoe UI"

},

title:{

textAlign:"center",

fontSize:"42px",

marginBottom:"30px"

},

formBox:{

background:

"rgba(255,255,255,0.08)",

padding:"30px",

borderRadius:"20px",

marginBottom:"30px",

backdropFilter:

"blur(18px)"

},

input:{

width:"100%",

padding:"14px",

marginBottom:"15px",

borderRadius:"12px"

},

textarea:{

width:"100%",

height:"90px",

padding:"14px",

marginBottom:"15px",

borderRadius:"12px"

},

createBtn:{

background:"#2563eb",

color:"#fff",

padding:"12px",

border:"none",

borderRadius:"12px",

cursor:"pointer"

},

filterBar:{

display:"flex",

gap:"10px",

marginBottom:"20px"

},

filterBtn:{

padding:"10px",

border:"none",

borderRadius:"10px",

color:"#fff"

},

grid:{

display:"grid",

gridTemplateColumns:

"repeat(auto-fit,minmax(320px,1fr))",

gap:"20px"

},

card:{

background:

"rgba(255,255,255,0.08)",

padding:"22px",

borderRadius:"18px"

},

actions:{

marginTop:"15px",

display:"flex",

gap:"10px"

},

approveBtn:{

background:"#10b981",

padding:"10px",

border:"none",

borderRadius:"10px",

color:"#fff"

},

rejectBtn:{

background:"#ef4444",

padding:"10px",

border:"none",

borderRadius:"10px",

color:"#fff"

},

historyBtn:{

background:"#3b82f6",

padding:"10px",

border:"none",

borderRadius:"10px",

color:"#fff"

},

modalOverlay:{

position:"fixed",

top:0,

left:0,

right:0,

bottom:0,

background:

"rgba(0,0,0,0.6)",

display:"flex",

justifyContent:"center",

alignItems:"center"

},

modal:{

background:"#1e293b",

padding:"25px",

borderRadius:"20px"

}

};

const getStatusStyle=(status)=>{

if(status==="approved")

return{

color:"#22c55e"

};

if(status==="rejected")

return{

color:"#ef4444"

};

return{

color:"#f59e0b"

};

};

export default Approvals;