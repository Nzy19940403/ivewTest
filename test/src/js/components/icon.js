////////////////////////////icon////////////////////////////////////////////
let icon=Vue.extend({
    name:'icon',
    template:'<i :class="iconInit"><span>{{icontext}}</span></i>',
    props:{
        iconcls:String,
        icontext:String
    },
    computed:{
        iconInit:function(){
          
            var t="fa ivu-icon "
 
            return  this.iconcls&&(t+=this.iconcls),
                    !this.icontext&&(t+=" icon-only"),t
        }
    }
    
})

Vue.component('icon',icon)