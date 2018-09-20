///////////////////////////////////////////button/////////////////////////////////////////////
let Nbutton = Vue.extend({
    name:'n-button',
    template:   '<button @click="onclick" class="ivu-btn" :class="innerCls" @focus="onfocus()" @blur="onblur()">'+
                    '<icon v-show="!isIconEmpty" :iconcls="iconcls"></icon>'+
                    '<span>'+
                        '<slot v-if="!isTextEmpty"></slot>'+
                        '<template v-if="isTextEmpty&&isIconEmpty">&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</template>'+
                    '</span>'+
                '</button>',

    props:{
        text:String,
        iconcls:String,
        iconAlign:{
            validator:function(value){
                return oneOf(value,['left','right','top','bottom']) 
            },
            default:'left'
        },
    },
    data(){
        return{
            focused:false
        }
    },
    methods:{
        onclick:function(event){
            this.$emit("click",event)
        },
        onfocus:function(){
            this.focused=!this.focused
        },
        onblur:function(){
            this.focused=false
        }
    },
    computed:{
        isTextEmpty:function(){

            return !this.text && !this.$slots.default

        },
        isIconEmpty:function(){
            //有icon的时候返回false
            return !this.iconcls
        },
        innerCls:function(){
            var t="icon-align-"

            return  this.iconAlign&&(t+=this.iconAlign),
                    this.focused&&(t+=' btn-focused'),
                    (this.isTextEmpty&&!this.isIconEmpty)&&(t+=' btn-icon-only'),t
        }
    }
    
})

Vue.component('n-button',Nbutton);

