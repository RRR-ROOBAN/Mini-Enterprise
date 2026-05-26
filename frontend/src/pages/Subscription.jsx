import {

useState

} from "react";

import API from "../services/api";


function Subscription(){

const[

plan,

setPlan

]=useState(

"Basic"

);


const upgrade=async()=>{

try{

await API.put(

`/subscription/upgrade/1?plan=${plan}`

);

alert(

`${plan} Activated 🚀`

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

🚀 Enterprise Plans

</h1>


<p style={styles.subtitle}>

Choose the best subscription for your organization

</p>


<div style={styles.cards}>


<div

style={

plan==="Basic"

?

styles.selectedCard

:

styles.card

}

>

<h2>

Basic

</h2>

<h1>

100

</h1>

<p>

Credits

</p>

<button

style={styles.cardButton}

onClick={()=>

setPlan(

"Basic"

)

}

>

Select

</button>

</div>



<div

style={

plan==="Silver"

?

styles.selectedCard

:

styles.card

}

>

<h2>

Silver

</h2>

<h1>

500

</h1>

<p>

Credits

</p>

<button

style={styles.cardButton}

onClick={()=>

setPlan(

"Silver"

)

}

>

Select

</button>

</div>



<div

style={

plan==="Gold"

?

styles.selectedCard

:

styles.card

}

>

<h2>

Gold

</h2>

<h1>

1000

</h1>

<p>

Credits

</p>

<button

style={styles.cardButton}

onClick={()=>

setPlan(

"Gold"

)

}

>

Select

</button>

</div>


</div>


<h2 style={styles.selected}>

Selected:

{plan}

</h2>


<button

style={styles.upgrade}

onClick={upgrade}

>

Upgrade Plan 🚀

</button>


</div>

);

}


const styles={

container:{

minHeight:"100vh",

padding:"50px",

background:

"linear-gradient(135deg,#020617,#0f172a)",

textAlign:"center"

},

title:{

fontSize:"42px",

fontWeight:"800",

background:

"linear-gradient(90deg,#60a5fa,#a855f7)",

WebkitBackgroundClip:

"text",

WebkitTextFillColor:

"transparent"

},

subtitle:{

color:"#cbd5e1",

marginBottom:"35px"

},

cards:{

display:"flex",

justifyContent:"center",

gap:"25px",

flexWrap:"wrap"

},

card:{

background:

"rgba(255,255,255,0.08)",

padding:"35px",

borderRadius:"22px",

width:"240px",

color:"#fff",

backdropFilter:

"blur(10px)",

boxShadow:

"0 8px 25px rgba(0,0,0,0.35)"

},

selectedCard:{

background:

"linear-gradient(135deg,#2563eb,#7c3aed)",

padding:"35px",

borderRadius:"22px",

width:"240px",

color:"#fff",

transform:

"scale(1.05)",

boxShadow:

"0 12px 35px rgba(99,102,241,0.5)"

},

cardButton:{

padding:"10px 18px",

border:"none",

borderRadius:"12px",

background:"#fff",

cursor:"pointer",

fontWeight:"700"

},

selected:{

marginTop:"35px",

color:"#fff"

},

upgrade:{

marginTop:"20px",

padding:"14px 28px",

background:

"linear-gradient(135deg,#2563eb,#7c3aed)",

border:"none",

borderRadius:"14px",

fontSize:"16px",

fontWeight:"700",

cursor:"pointer",

color:"#fff",

boxShadow:

"0 8px 25px rgba(99,102,241,0.35)"

}

};


export default Subscription;