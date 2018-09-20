// 判断参数是否是其中之一
function oneOf (value, validList) {
    for (let i = 0; i < validList.length; i++) {
        if (value === validList[i]) {
            return true;
        }
    }
    return false;
}

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
        // text:String,
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






////////////////////////////////dropdown//////////////////////////////////////////////////////////////

let Ndropdownmenu=Vue.extend({
    name:'Ndropdownmenu',
    template:   '<ul class="ivu-dropdown-menu"><slot></slot></ul>',
    // data(){

    // },
    props:{

    },
    computed:{

    },
    methods:{

    }
})

Vue.component('n-dropdownmenu',Ndropdownmenu)

let Ndropdownitem=Vue.extend({
    name:'Ndropdownitem',
    template:'<li :class="classes" @click="handleClick"><slot></slot></li>',

    props:{
        name: {
            type: [String, Number]
        },
        disabled: {
            type: Boolean,
            default: false
        },
        selected: {
            type: Boolean,
            default: false
        },
        divided: {
            type: Boolean,
            default: false
        }
    },
    computed:{
        classes:function(){
            var t='ivu-dropdown-item';
            return t
        }
    },
    methods:{
        handleClick:function(){
            alert(1)
        }
    }
})

Vue.component('n-dropdownitem',Ndropdownitem)

let Ndrop=Vue.extend({
    name:'Ndrop',
    template:'<div class="ivu-select-dropdown" :class="className" :style="styles"><slot></slot></div>',
   
    props:{
        placement: {
            type: String,
            default: 'bottom-start'
        },
        className: {
            type: String
        },
        transfer: {
            type: Boolean
        }
    },
    computed:{
        styles:function(){

        }
    },
    methods:{
        update(){

        },
        destroy(){

        }
    }
});

Vue.component('n-drop',Ndrop);

let Ndropdown=Vue.extend({
    name:'Ndropdown',
    template:   '<div class="ivu-dropdown"  v-click-outside="onClickoutside"  @mouseenter="handleMouseenter" @mouseleave="handleMouseleave">'+
                    '<div :class="relCls"  @click="handleClick" @mouseenter="handleMouseenter" '+
                    '><slot></slot></div>'+

                    '<n-drop ref="drop" '+
                    'v-show="currentVisible"'+
                    '><slot name="list"></slot></n-drop>'+
                '</div>',
    props:{
        trigger: {
            validator (value) {
                return oneOf(value, ['click', 'hover', 'custom', 'contextMenu']);
            },
            default: 'hover'
        },
        placement: {
            validator (value) {
                return oneOf(value, ['top', 'top-start', 'top-end', 'bottom', 'bottom-start', 'bottom-end', 'left', 'left-start', 'left-end', 'right', 'right-start', 'right-end']);
            },
            default: 'bottom'
        },
        visible: {
            type: Boolean,
            default: false
        },
    },
    data(){
        return {   
            currentVisible: this.visible
        }
    },
    computed:{
        relCls:function(){
            return[
                'ivu-dropdown-rel',
                {
                    ['ivu-dropdown-rel-user-select-none']:this.trigger === 'contextMenu'
                }
            ]
        },
    },
    methods:{
        onClickoutside:function(){
            this.currentVisible=false;
        },
        handleClick:function(){
            
            if (this.trigger === 'custom') return false;
            if (this.trigger !== 'click') {
                return false;
            }
    
            this.currentVisible = !this.currentVisible;


        
      
        },
        handleMouseenter:function(){
            if (this.trigger === 'custom') return false;
            if (this.trigger !== 'hover') {
                return false;
            }
            if (this.timeout) clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                this.currentVisible = true;
            }, 250);
            
        },
        handleMouseleave:function(){
            if (this.trigger === 'custom') return false;
            if (this.trigger !== 'hover') {
                return false;
            }
            if (this.timeout) {
                clearTimeout(this.timeout);
                this.timeout = setTimeout(() => {
                    this.currentVisible = false;
                }, 150);
            }
        }
        
    },
    watch:{
        visible(val){
            this.currentValue=val
        },
        currentVisible (val) {
            if (val) {
                this.$refs.drop.update();
            } else {
                this.$refs.drop.destroy();
            }
            
            this.$emit('on-visible-change', val);
        }
    }
});

Vue.component('n-dropdown',Ndropdown);

/////////////////////////inputnumber/////////////////////////

let Ninputnumber = Vue.extend({
    name:'Ninputnumber',
    mixins: [ Emitter ],
    template:   '<div :class="WrapperCls">'+
                    '<div :class="btnWrapperCls">'+
                        '<div class="ive-inputnumber-up-btn" @click="up"><span @click="preventDefault"><icon iconcls="fa-angle-up"></icon></span></div>'+
                        '<div class="ive-inputnumber-down-btn"@click="down"><span @click="preventDefault"><icon iconcls="fa-angle-down"></icon></span></div>'+
                    '</div>'+

                    '<div :class="inputWrapperCls">'+
                        '<input class="ivu-input-number-input" :value="formatterValue" ref="myinputnumber"'+
                        '@focus="focus" @blur="blur"'+
                        ' @input="change" :autofocus="autofocus" autocomplete="off"spellcheck="false" @mouseup="preventDefault">'+
                    '</div>'+
                '</div>',
    data(){
        return{
            currentValue:this.value,
            focused: false,
        }
    },
    props:{
        size:{
            validator:function(value){
               return oneOf(value,['default','small','large']);
            },
            default:'default'
        },
        value: {
            type: Number,
            default: 1
        },
        disabled: {
            type: Boolean,
            default: false
        },
        autofocus: {
            type: Boolean,
            default: false
        },
        readonly: {
            type: Boolean,
            default: false
        },
        editable: {
            type: Boolean,
            default: true
        },
        name: {
            type: String
        },
        precision: {
            type: Number
        },
        elementId: {
            type: String
        },
        formatter: {
            type: Function
        },
        parser: {
            type: Function
        },
        placeholder: {
            type: String,
            default: ''
        },
        step: {
            type: Number,
            default: 1
        },
        max: {
            type: Number,
            default: Infinity
        },
        min: {
            type: Number,
            default: -Infinity
        },
        precision:Number
    },
    computed:{
        WrapperCls:function(){
            var t='ivu-input-number'
            this.size&&(t+=(' ive-input-number-'+this.size))

            return t
        },
        btnWrapperCls:function(){
            var t='ivu-input-number-handler-wrap'

            return t
        },
        inputWrapperCls:function(){
            var t='ivu-input-number-input-wrap'

            return t
        },
        precisionValue () {
            // can not display 1.0
            if(!this.currentValue) return this.currentValue;
            return this.precision ? this.currentValue.toFixed(this.precision) : this.currentValue;
        },
        formatterValue () {
            if (this.formatter && this.precisionValue !== null) {
                return this.formatter(this.precisionValue);
            } else {
                return this.precisionValue;
            }
        }
    },
    methods:{
        preventDefault:function(e){
            e.preventDefault();
        },
        up:function(e){
            const targetVal = Number(e.target.value);
            if (this.upDisabled && isNaN(targetVal)) {
                return false;
            }

            this.changeStep('up', e);
        },
        down:function(){
            alert('down')
        },
        focus (event) {
            this.focused = true;
    
            this.$emit('on-focus', event);
        },
        blur () {
            this.focused = false;
      
            this.$emit('on-blur');
        },
        changeStep:function(type, e){
            if (this.disabled || this.readonly) {
                return false;
            }

            const targetVal = Number(e.target.value);
            let val = Number(this.currentValue);
            const step = Number(this.step);
            if (isNaN(val)) {
                return false;
            }

            // input a number, and key up or down
            if (!isNaN(targetVal)) {
                if (type === 'up') {
                    if (addNum(targetVal, step) <= this.max) {
                        val = targetVal;
                    } else {
                        return false;
                    }
                } else if (type === 'down') {
                    if (addNum(targetVal, -step) >= this.min) {
                        val = targetVal;
                    } else {
                        return false;
                    }
                }
            }

            if (type === 'up') {
                val = addNum(val, step);
            } else if (type === 'down') {
                val = addNum(val, -step);
            }
            this.setValue(val);
        },
        setValue:function(val){
            // 如果 step 是小数，且没有设置 precision，是有问题的
            if (val && !isNaN(this.precision)) val = Number(Number(val).toFixed(this.precision));
                
            const {min, max} = this;
            if (val!==null) {
                if (val > max) {
                    val = max;
                } else if (val < min) {
                    val = min;
                } 
            }
            
            this.$nextTick(() => {
                this.currentValue = val;
                this.$emit('input', val);
                this.$emit('on-change', val);
                // this.dispatch('FormItem', 'on-form-change', val);
            });
        },
        change:function(e){
            
            let val=e.target.value.trim()
            const isEmptyString = val.length === 0;
            if(isEmptyString){
                return;
            }
            val=Number(val)
            
            if (!isNaN(val)) {
                this.currentValue = val;
            } else {
                event.target.value = this.currentValue;
            }
           
        },
        changeVal (val) {
            val = Number(val);
            if (!isNaN(val)) {
                const step = this.step;

                this.upDisabled = val + step > this.max;
                this.downDisabled = val - step < this.min;
            } else {
                this.upDisabled = true;
                this.downDisabled = true;
            }
        },
        
    },
    mounted () {
        this.changeVal(this.currentValue);
    },
    watch: {
        value (val) {
            this.currentValue = val;
        },
        currentValue (val) {
            this.changeVal(val);
        },
        min () {
            this.changeVal(this.currentValue);
        },
        max () {
            this.changeVal(this.currentValue);
        }
    }
    
    
})

Vue.component('n-inputnumber',Ninputnumber);

//////////////////////////////////table