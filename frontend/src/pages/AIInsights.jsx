import {

useEffect,

useState

} from "react";

import API from "../services/api";


function AIInsights(){

const [

data,

setData

]=useState(null);


useEffect(()=>{

fetchInsights();

},[]);


const fetchInsights=async()=>{

try{

const res=

await API.get(

"/ai/insights",

{

headers:{

Authorization:

`Bearer ${

localStorage.getItem(

"token"

)

}`

}

}

);

setData(

res.data

);

}

catch(err){

console.log(

err

);

}

};


return(

<div style={styles.container}>

<h1 style={styles.title}>

🧠 Intelligent Features

</h1>


{

data && (

<div style={styles.grid}>


<div style={styles.card}>

<h2>

🔥 High Priority

</h2>

<p style={styles.number}>

{

data.high_priority_pending

}

</p>

</div>


<div style={styles.card}>

<h2>

⏳ Delay Risk

</h2>

<p

style={

data.delay_risk>0

?

styles.danger

:

styles.success

}

>

{

data.delay_risk

}

</p>

</div>


<div style={styles.card}>

<h2>

⚠ Overloaded Users

</h2>

{

data.overloaded_users.length===0

?

(

<p>

No overload

</p>

)

:

(

data.overloaded_users.map(

(

u,

i

)=>(

<div

key={i}

style={styles.overloadUser}

>

<b>

{u.user}

</b>

<br/>

{

u.pending_tasks

}

Tasks

</div>

)

)

)

}

</div>


<div style={styles.card}>

<h2>

🧠 Best By Workload

</h2>

<div

style={styles.overloadUser}

>

<b>

{

data

.recommended_by_workload

.user

||

"No recommendation"

}

</b>

<br/>

Pending:

{

data
.recommended_by_workload
?.pending

??

0

}

</div>

</div>


<div style={styles.card}>

<h2>

🏆 Best Performer

</h2>

<div

style={styles.overloadUser}

>

<b>

{

data
.recommended_by_history
?.user

||

"No data"

}

</b>

<br/>

Completed:

{

data

.recommended_by_history

.completed

}

</div>

</div>


</div>

)

}

</div>

);

}


const styles={

container:{

padding:"30px",

background:

"linear-gradient(135deg,#020617,#0f172a)",

minHeight:"100vh",

color:"#fff"

},

title:{

fontSize:"42px",

fontWeight:"700",

marginBottom:"30px",

background:

"linear-gradient(90deg,#60a5fa,#a855f7)",

WebkitBackgroundClip:

"text",

WebkitTextFillColor:

"transparent"

},

grid:{

display:"grid",

gridTemplateColumns:

"repeat(auto-fit,minmax(300px,1fr))",

gap:"25px"

},

card:{

background:

"rgba(30,41,59,0.85)",

padding:"30px",

borderRadius:"22px",

backdropFilter:

"blur(10px)",

border:

"1px solid rgba(255,255,255,0.08)",

boxShadow:

"0 8px 25px rgba(0,0,0,0.35)"

},

number:{

fontSize:"48px",

fontWeight:"bold",

color:"#3b82f6"

},

success:{

fontSize:"48px",

fontWeight:"bold",

color:"#10b981"

},

danger:{

fontSize:"48px",

fontWeight:"bold",

color:"#ef4444"

},

overloadUser:{

padding:"15px",

background:"#334155",

marginTop:"10px",

borderRadius:"10px"

}

};


export default AIInsights;