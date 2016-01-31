//	A generic class for a Firefox OS quick setting button
var QSBtn = function(params){
    this.icon = params.icon ;
    this.name = params.name ;
    
    this.click = params.click ;
    this.step_press = params.step_press ;										// action each second during mousedown
    this.longclick = params.longclick ;
    this.dblclick = params.dblclick ;
    
    this.btn = null ;															// the dom instance of this button
    
    this.pressing = null ;														// the interval function instance
    this.dbl_tapping = false ;
    this.mds_tm = null ;														// the mouse down start time
    
    var that = this ;
    
    this.set_btn_addon = function(){
        var li = document.createElement('li');									// creation of the button
        var btn = document.createElement('a');
        btn.id = 'quick-settings-'+this.name;
        btn.classList.add('icon');
        btn.classList.add('bb-button');
        btn.setAttribute('role', 'button');
        btn.setAttribute('aria-hidden', 'true');
        btn.href = '#';
        li.appendChild(btn);
        document.querySelector('#quick-settings ul').appendChild(li);

        if (typeof this.icon === "function") {									// if the creation of buton is a function
            this.icon(btn);
		}else{
            btn.setAttribute('data-icon', this.icon);							// else data-icon
        }
        this.btn = btn ;
        this.gest_click();
        console.log('button created');
    }
     
    this.gest_click = function(){
        this.btn.addEventListener('touchstart',function(){						// mousedown
            var ntime = new Date().getTime();
            if(ntime - that.mds_tm < 1000)										// if last touch start is less than 1 second old
                that.dbl_tapping = true ;
            if(that.step_press)													// step pressing
                that.pressing = setInterval(function(){that.step_press(that)},1000);
            that.mds_tm = ntime ;
        });
        this.btn.addEventListener('touchend',function(){						// mouseup
            clearInterval(that.pressing);
            var long = new Date().getTime() - that.mds_tm ;
            if(long > 500 && that.longclick){									// long click (more than 0.5 second)
                that.longclick(that);
            }else{
                if(that.dbl_tapping && that.dblclick)							// simple click
                    that.dblclick(that);
                else															// double click
                	that.click(that);
            }
            that.dbl_tapping = false ;
        });
    };
    
    if (document.readyState === 'complete') {									// to init the button
        console.log('document state is complete');
        that.set_btn_addon();
    } else {
        console.log('document is not ready');
        window.addEventListener('DOMContentLoaded',function(){that.set_btn_addon()});
    }
        
};
