

let linkbutton=Vue.extend({
    name:'linkbutton',
    template:   '<a ref="btnRef"  :href="href||\'#\'"   class="btn"  @click="onclick()" @focus="onfocus()" :class="innerCls" @blur="blur()">'+
                    '<span :class="btnLeftCls">'+
                        '<span class="l-btn-text"><slot v-if="!text"></slot> <template v-else>{{text}}</template> <template v-if="isEmpty">&nbsp&nbsp&nbsp&nbsp;</template> </span>'+
                        '<slot name="iconcls" v-if="iconCls"><span class="l-btn-icon"><i :class="iconWrap"></i></span></slot>'+
                    '</span>'+
                '</a>',
    data: function () {
        return {
            selectedState: this.selected,
            focused: false
        }
    },
    props:{
        disable:{
            type:Boolean,
            default: false
        },
        toggle:{
            type:Boolean,
            default:false
        },
        selected:{
            type:Boolean,
            default:false
        },
        // outline: {
        //     type: Boolean,
        //     default:false       
        // },
        plain: {
            type: Boolean,
            default:false
         
        },
        text: String,
        iconCls: String,
        iconAlign: {
            type: String,
            default:"left"
        },
        size: {
            type: String,
            default: "small"
        },
        href: String,
        btnCls: String,
        btnStyle: Object,
        // message:String

    },
    watch: {
        selected: function (t) {
 
            this.selectedState = t
           
        }
    },
    mounted: function () {
  
        this.$parent && "ButtonGroup" == this.$parent.$options.name && this.$parent.addButton(this)
    },
    beforeDestroy: function () {
        this.$parent && "ButtonGroup" == this.$parent.$options.name && this.$parent.removeButton(this)
    },
    methods:{
        onclick:function(t){
            if(this.disable)return;
 
            // if (t.stopPropagation(), this.disabled) return t.preventDefault(),false;
            // this.href || t.preventDefault(),
 
            this.toggle && (this.selectedState = !this.selectedState),
            this.$emit("click")
       
        },
        onfocus:function(){
            
            this.$refs.btnRef.focus(),
            this.focused = true
      
        },
        blur:function(){
            this.$refs.btnRef.blur(),//???????????????
            this.focused=false
        }
    },
    computed:{
        
        isEmpty:function(){
         
            return !this.text && !this.$slots.default
            
        },
        isDisabled: function () {
            return this.disable
        },
        innerCls:function(){
            var t="l-btn f-inline-row f-content-center";

            return t+=" l-btn-" + this.size,
            this.plain && (t += " l-btn-plain"),
            this.selectedState && (t += this.plain ? " l-btn-selected l-btn-plain-selected" : " l-btn-selected"),
            this.isDisabled && (t += this.plain ? " l-btn-disabled l-btn-plain-disabled" : " l-btn-disabled"),
            this.focused && (t += " l-btn-focus"),
            this.btnCls && (t += " " + this.btnCls),
            t
           
        },

        btnLeftCls: function () {
            var t = "l-btn-left";

            return this.iconCls && (t += " l-btn-icon-" + this.iconAlign),t
        
        },
        iconWrap:function(){
    

            var t="fa ";
            
            return this.iconCls&&(t+=this.iconCls),t
        }
        
        
    }
})

Vue.component('linkbutton',linkbutton)