
let mytablemixin={
    methods:{
        setCellWidth:function(column){
            let width='';
            if(column.width){
                width=column.width
            }

            if (width === '0') width = '';
            return width
        }
    }
}


////////////////////////////////////////////////////////////////////////////////////////////
    //table组件汇总
let Ntable=Vue.extend({
    name:'Ntable',
    template:   '<div class="ivu-table-wrapper" :style="wrapperStyles">'+
                    '<div :class="classes">'+
                        '<div class="ivu-table-header" v-if="showHeader">'+
                            '<n-tablehead :columns="columns" :allowSort="sortable" @sort-down="sortDown($event)"></n-tablehead>'+
                        '</div>'+
                        '<div class="ivu-table-body">'+
                            '<n-tablebody :data="data" :editable="editable" ref="tbody"></n-tablebody>'+
                        '</div>'+
                        '<div v-if="showPage" class="ivu-page-wrapper" >'+
                            '<n-page></n-page>'+
                        '</div>'+
                    '</div>'+
                '</div>',
    data(){
        return{
            currentHeight:this.height,
            
        }
    },
    props:{
        columns:[Array,Object],
        data:[Object,Array],
        size:{
            validator(val){
                return oneOf(val,['default','large','small']);
            },
            default:'default'
        },
        showHeader:{
            type:Boolean,
            default:true
        },
        showPage:{
            type:Boolean,
            default:true
        },
        editable:{
            type:[String,Boolean,Array],
            default:false
        },
        height:Number,
        sortable:Boolean 
    },
    computed:{
        classes:function(){
            return [
                'ivu-table',
                {
                    ['ivu-table-'+this.size]:!!this.size
                }
            ]
            
        },
        wrapperStyles:function(){
            let style={};
            if(this.height){
                style.height=this.height+'px'

            }
            return style
        },
        
    },
    methods:{
        sortDown:function(e){
            let t=e.currentTarget.parentElement.previousSibling.innerText;
            let tbody=this.$refs.tbody;

           // tbody.currentData=sortKey(tbody.currentData,t)
            
            console.log(tbody.currentData)
        }
    },
    watch:{
        
    },
    mounted(){
       
        if(this.currentHeight&&this.showHeader){
            let header=this.$el.children[0].children[0],
            body=this.$el.children[0].children[1];
            if(this.showPage){
                let page=this.$el.children[0].children[2];
                body.style.height=this.currentHeight-header.offsetHeight-page.offsetHeight+'px'
            }else{
                body.style.height=this.currentHeight-header.offsetHeight+'px'
            }
            
       
            
        }
        
    }
});

Vue.component('n-table',Ntable);


//table-header
let Ntablehead=Vue.extend({
    name:'Ntablehead',
    mixins:[mytablemixin],
    template:   '<table >'+
                    '<colgroup>'+
                        '<col v-for="(item,index) in currentColumns" :width="setCellWidth(item)">'+
                    '</colgroup>'+
                    '<thead ref="mytablehead">'+
                        '<tr>'+
                            '<th v-for="(item,index) in currentColumns">'+
                                '<div :class="tableCellCls">'+
                                    '<template v-if="isSelection">'+

                                    '</template>'+
                                    '<template v-else>'+
                                        '<span>{{item.title}}</span>'+
                                        '<div class="sort-btn" v-if="item.sortable&&allowSort">'+
                                            '<icon iconcls="fa-angle-down" @click.native.stop="sortDown($event)"></icon>'+
                                            '<icon iconcls="fa-angle-up"></icon>'+
                                        '</div>'+
                                    '</template>'+
                                '</div>'+
                            '</th>'+
                        '</tr>'+
                    '</thead>'+
                '</table>',
    data(){
        return{
            currentColumns:this.columns,
        }
    },
    props:{
        columns:[Array,Object],
        allowSort:Boolean
    },
    computed:{
        tableCellCls:function(column){
            if(column==='selection'){
                return 'ivu-table-selection'
            }else{
                return 'ivu-table-cell'
            }
        },
        isSelection:function(column){
            if(column.type==='selection'){
                return true
            }

            return false
        }
    },
    methods:{
        sortDown:function(e){
            this.$emit('sort-down',e)
        }
    }
});

Vue.component('n-tablehead',Ntablehead);

let Ntablebody=Vue.extend({
    name:'Ntablebody',
    template:   '<table>'+
                    '<tbody class="ivu-table-tbody" ref="mytablebody">'+
                        '<n-tr v-for="(item,index) in currentData" class="ivu-table-row" :row="item" :rowIndex="index" :key="item._rowKey"'+
                        ' @mouseenter.native.stop="handleMouseIn(index)" @mouseleave.native.stop="handleMouseOut(index)" >'+
                            
                            '<td v-for="(value,key,index) in item" @click="handleClick($event)">'+
                                '<n-cell :value="value" :keys="key" :editable="editable" :allowedit="isEditable"></n-cell>'+
                            '</td>'+
    
                        '</n-tr>'+
                    '</tbody>'+
                '</table>',
    props:{
        data:[Object,Array],
        editable:{
            type:[String,Boolean,Array],
            default:false
        },
    },
    data(){
        return{
            currentData:this.data,
            
        }
    },
    computed:{
        isEditable:function(){
         
            if(this.editable===""){
                return true
                
            }else if(typeof(this.editable)=='string'){
                let target=this.editable,
                    headerColumns=this.$parent.columns,
                    data=[];
                
                for(let i=0;i<headerColumns.length;i++){
                    data[i]=headerColumns[i].key
                }
               
                
                return oneOf(target,data)

                
            }else if(typeof(this.editable)=='object'&&this.editable instanceof Array){
                return true
            }
            
        },
        // currentData:{
        //     get:function(){
        //         return this.currentData
        //     },
        //     set:function(n){
        //         this.currentData=n
        //     }
            
        // }
        

       
    },
    methods:{
        handleMouseIn:function(index){
            
            this.$refs.mytablebody.children[index].classList.add('ivu-table-row-hover')
          
        },
        handleMouseOut:function(index){
            this.$refs.mytablebody.children[index].classList.remove('ivu-table-row-hover')
        },
        handleClick:function(e){
            if(this.isEditable){
                let t=this.editable;
                //let kk=e.currentTarget.attributes[0].nodeValue
                
                
            
            }
            
        },
        
        
    },
    watch:{
       currentData:function(){
           console.log(666)
       }
    },
    mounted() {
        
    },
});

Vue.component('n-tablebody',Ntablebody);



let Ncell=Vue.extend({
    name:'Ncell',
    template:   '<div :class="cellCls">'+
                    '<template v-if="isCellEditable&&allowedit">'+
                        '<n-input size="small" :value="value" v-if="!isNum"></n-input>'+
                        '<n-inputnumber v-else :value="value"></n-inputnumber>'+
                    '</template>'+
                    '<template v-else>'+
                        '<span>{{value}}</span>'+
                    '</template>'+
                    
                '</div>',
    props:{
        editable:{
            type:[String,Boolean,Array],
            default:false
        },
        value:[String,Number],
        keys:String,
        allowedit:Boolean,
    },
    computed:{
        cellCls:function(){
            var t="ivu-table-cell"
            return t
        },
        isCellEditable:function(){
            let type=typeof(this.editable);
                   
            if(type=='string'){
                if(this.editable===""){
                    return true
                }else if(this.editable==this.keys){
                    return true
                }else{
                    return false
                }
            }else if(type=='boolean'){
                if(this.editable){
                    return true
                }else{
                    return false
                }
            }else if(type=='object'){
                if(this.editable instanceof Array){
                    let t;
                    t=oneOf(this.keys,this.editable);
                    if(t){
                        
                        return true
                    }else{
                        return false
                    }
                }else{
                    return false
                }
             
            }   
        },
        isNum:function(){
            var t=this.value;
            if(typeof(t)=='number'){
                return true
            }
            return false
        }

    }
});

Vue.component('n-cell',Ncell);

let Ntabletr= Vue.extend({
    name:'Ntabletr',
    template:'<tr><slot></slot></tr>',
    props:{
        row:Object,
        rowIndex:Number
    }
});

Vue.component('n-tr',Ntabletr);

let Npage=Vue.extend({
    name:'Npage',
    template:   '<ul class="ivu-page">'+
                    '<span v-if="showTotal"></span>'+
                    '<li class="ivu-page-prev" @click="prev"><icon iconcls="fa-angle-left"></icon></li>'+
                    '<li title="1" :class="firstPageClasses" @click="changePage(1)"><a>1</a></li>'+
                    '<li class="ivu-page-next" @click="next"><icon iconcls="fa-angle-right"></icon></li>'+
                    
                '</ul>',
    
    props:{
        showTotal:{
            type: Boolean,
            default: false
        },
        pageSize: {
            type: Number,
            default: 10
        },
    },
    data () {
        return {
            currentPageSize: this.pageSize
        };
    },
    computed:{
        firstPageClasses:function(){
            return[
                'ivu-page-item',
                {
                    ['ivu-page-item-active']:this.currentPage===1
                }
            ]
        }
    },
    methods:{
        prev:function(){
            alert('prev')
        },
        next:function(){
            alert('next')
        },
        changePage:function(){
            
        }
    }
})

Vue.component('n-page',Npage);



// function sortKey(array,key){
//             return array.sort(function(a,b){
//             var x = a[key];
//             var y = b[key];
//             return ((x<y)?-1:(x>y)?1:0)
//         })
//     }