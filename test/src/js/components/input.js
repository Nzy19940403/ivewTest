
////////////////////////////////////input/////////////////////////////////////////////////
let Ninput=Vue.extend({
    name:'Ninput',
    template:   '<div :class="wrapperCls" >'+
                    '<div v-if="prepend" class="ivu-input-group-prepend"v-show="prependSlotReady"><slot name="prepend"></slot></div>'+

                    
                    
                    '<div class="input-inner-wrapper">'+

                    '<span class="ivu-input-perfix" v-if="showPerfix"><i class="fa" :class="perfix"></i></span>'+

                    '<textarea  v-if="istextarea"  :class="innerCls" @keyup.enter="handleEnter" :readonly="readonly" '+
                    ':placeholder="placeholder" :disabled="disabled" :value="currentValue" ref="mytextarea" '+
                    ' @input="handleInput"  :rows="rows"@keyup="handleKeyup"@keypress="handleKeypress"@keydown="handleKeydown"'+
                    ' @focus="handleFocus"@blur="handleBlur"></textarea>'+

                    
                    '<input v-else  :class="innerCls" :type="type" ref="myinput" :number="number"'+
                    ':placeholder="placeholder" :disabled="disabled" :value="currentValue" :readonly="readonly"'+
                    ' @input="handleInput" @keyup.enter="handleEnter"  @keyup="handleKeyup" @keypress="handleKeypress"'+
                    '@keydown="handleKeydown" @focus="handleFocus"@blur="handleBlur" @change="handleChange">'+
                    
                    '<i v-show="clearAble &&currentValue" class="fa fa-times-circle clear-icon" @click="handleClear" ref="myclearicon"></i>'+
                    '<span class="ivu-input-suffix" v-if="showSuffix"><i class="fa" :class="suffix"></i></span>'+

                    '</div>'+

                    
                    '<div v-if="search&&!istextarea" class="search-btn ivu-input-search" @click="handleSearch">{{enterButton}}</div>'+
                    '<div v-if="append" class="ivu-input-group-append"v-show="appendSlotReady"><slot name="append"></slot></div>'+
                '</div>',
    data(){
        return {
            showSuffix:false,
            showPerfix:false,
            currentValue:this.value,
            clearAble:this.clearable,
            prepend: true,
            append:true,
            prependSlotReady: false,
            appendSlotReady:false,
        }
    },
    props:{
        size:{
            validator(value){
                return oneOf(value,['large','default','small'])
            },
            default:'default'
        },
        type:{
            validator (value) {
                return oneOf(value, ['text', 'textarea', 'password', 'url', 'email', 'date']);
            },
            default: 'text'
        },
        readonly:{
            type:Boolean,
            default:false
        },
        number: {
            type: Boolean,
            default: false
        },
        value:{
            type:[String,Number],
            default:''
        },
        enterButton:{
            type:[String,Boolean],
            default:false
        },
        search:Boolean,
        rows:Number,
        clearable:Boolean,
        disabled:Boolean,
        suffix:String,
        perfix:String,
        placeholder:String
        
    },
    methods:{
        handleEnter:function(){
     
            this.$emit('on-enter', event);
        },
        handleInput:function(event){
            let value = event.target.value;
            if (this.number && value !== '') value = Number.isNaN(Number(value)) ? value : Number(value);
            this.$emit('input', value);
            this.setcurrentValue(value);
           
            this.$emit('on-change', event);
  
        },
        handleClear:function(){
            event.target.value='';
            this.setcurrentValue('');
        },
        handleKeydown (event) {
            this.$emit('on-keydown', event);
        },
        handleKeypress(event) {
            this.$emit('on-keypress', event);
        },
        handleKeyup (event) {
            this.$emit('on-keyup', event);
        },
        handleFocus(event){
            this.$emit('on-focus', event);
        },
        handleBlur(event){
            this.$emit('on-blur', event);
        },
        handleChange(event){
            this.$emit('on-input-change', event);
        },
        handleSearch(event){
            if (this.disabled) return false;
            this.$refs.myinput.focus();
            this.$emit('on-search', this.currentValue);
        },
        setcurrentValue:function(value){
            if (value === this.currentValue) return;
            
            this.currentValue = value;
        },
        
    },
    watch:{
        currentValue:function(){
            if(!this.clearable) return
         
            this.suffix&&(
                this.showSuffix=(this.currentValue)? false:true,
                this.$refs.myclearicon.style.right='0px'
            )
            this.perfix&&(
                this.showPerfix=(this.currentValue)? false:true,
                this.$refs.myclearicon.style.left='0px'
            )
        }
    },
    computed:{

        istextarea:function(){
     
            if(this.type=='textarea'){
                this.clearAble=false;
                return true
            }else{
                return false
            }
        },
        isIconTextEmpty:function(){
            if(this.icontext==undefined) {
                return false
            }else{
                return true
            }
        },
        wrapperCls:function(){
            var t='ivu-input-wrapper ivu-input-wrapper-';

            this.size&&(t+=this.size);
            (this.prependSlotReady||this.appendSlotReady||this.search)&&(t+=' ivu-input-group')
            this.prependSlotReady&&(t+=' ivu-input-group-with-prepend');
            this.appendSlotReady&&(t+=' ivu-input-group-with-append');

            return t
        },
        innerCls:function(){
            var t='ivu-input ';
         
            return  (this.size&&this.istextarea)?t:t+=('ivu-input-'+this.size),
                    this.istextarea&&(t+='ive-input-textarea'),t    
        },
       
    },
    mounted() {
        if(!this.istextarea){
            this.suffix&&(
                this.showSuffix=!this.showSuffix,      
                this.$refs.myinput.style.paddingRight="32px"

            );
            this.perfix&&(
                this.showPerfix=!this.showPerfix,
                this.$refs.myinput.style.paddingLeft="32px"
            );

           

        }else {
            this.prepend = false;
            this.append = false;
        }
        
        this.$slots.prepend&&(this.prependSlotReady=true);
        this.$slots.append&&(this.appendSlotReady=true);
    },
    
})

Vue.component('n-input',Ninput)