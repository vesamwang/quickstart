/**
 * Created by 261685 on 2017/7/17.
 */


import {Subscription, BehaviorSubject,ReplaySubject, Subject} from 'rxjs';
import {Observable,Observer,Scheduler} from 'rxjs';


//observable可观察对象
function observable(){
  console.log('observable可观察对象');
  let foo=Observable.create(function(observer:any){
    console.log('Hello');
    observer.next(42);
  });
  foo.subscribe(function(x:any){
    console.log(x);
  });
  foo.subscribe(function (y:any){
    console.log(y);
  });
}
function subject1(){
  var subject = new Subject();
  subject.subscribe({
    next: (v) => console.log('observerA: ' + v)
  });
  subject.subscribe({
    next: (v) => console.log('observerB: ' + v)
  });
  subject.next(1);
  subject.next(2);

  console.log('observable可观察对象');
  let foo=Observable.create(function(observer:any){
    console.log('Hello');
    observer.next(42);
  });
  foo.subscribe({
    next: (v:any) => console.log('observer1: ' + v)
  });
  foo.subscribe({
    next: (v:any) => console.log('observer2: ' + v)
  });

}




// Subject主题
function subject2(){
  console.log('Subject主题');
  let source:Observable<number> = Observable.interval(500);
  let subject = new Subject();
  let refCounted = source.multicast(subject).refCount();
  let subscription1:Subscription;
  let subscription2:Subscription;
  console.log('observerA subscribed');
  subscription1 = refCounted.subscribe({
    next: (v) => console.log('observerA: ' + v)
  });
  setTimeout(() => {
    console.log('observerB subscribed');
    subscription2 = refCounted.subscribe(
      v => console.log('observerB: ' + v)
    );
  }, 600);

  setTimeout(() => {
    console.log('observerA unsubscribed');
    subscription1.unsubscribe();
  }, 1200);

  setTimeout(() => {
    console.log('observerB unsubscribed');
    subscription2.unsubscribe();
  }, 2000);

}


// BehaviorSubject主题
function behaviorSubject(){
  console.log('BehaviorSubject主题');
  let subject1 = new BehaviorSubject(0); // 0 is the initial value
  subject1.subscribe({
    next: (v) => console.log('observerC: ' + v)
  });
  subject1.next(1);
  subject1.next(2);
  subject1.subscribe({
    next: (v) => console.log('observerD: ' + v)
  });
  subject1.next(3);
}
// ReplaySubject主题
function replaySubject(){
  console.log('ReplaySubject主题');
  let  subject = new ReplaySubject(3); // buffer 3 values for new subscribers ，注:缓存了三个值。
  subject.subscribe({
    next: (v) => console.log('observerA: ' + v)
  });
  subject.next(1);
  subject.next(2);
  subject.next(3);
  subject.next(4);
  subject.subscribe({
    next: (v) => console.log('observerB: ' + v)
  });
  subject.next(5);
}

// operrator:实例操作符主题
/*操作符是可观察对象上定义的方法，例如.map(...),.filter(...),.merge(...)，等等。当
 他们被调用，并不会去改变当前存在的可观察对象实例。相反，他们返回一个新的
 可观察对象，而且新返回的subscription订阅对象逻辑上基于调用他们的我观察对
 象。*/
function multiplyByTen(input:any) {
  let output =Observable.create(function(observer:any){
    input.subscribe({
      next: (v:any) => observer.next(10*v),
      error: (err:any) => observer.error(err),
      complete: () => observer.complete()
    });
  });
  return output;
}

function  multiplyByTenUse(){
  let input = Observable.from([1,2,3,4,5]);
  let output = multiplyByTen(input);
  output.subscribe((x: any) => console.log(x));
 }


/*最常规的静态操作符是被称作构造操作符(Creation Operators，原谅我如此翻译，
总是隐隐觉得很合适~)。不同于将一个输入的可观察对象转换成一个输出的可观察
对象，它们仅接收一个非可观察对象作为参数，比如一个数字，然后构造出一个可
观察对象.一个静态操作符的典型例子是interval函数。它接收一个数字(而不是一个可观察对
 象)作为输入的参数，然后到一个可观察对象作为输出*/

function interval(){
  let numbers = Observable.interval(10000).take(10);
  numbers.subscribe(x => console.log(x));
}

/**
 * 操作符用例-merge
 */
function merge() {
  let timer1 = Observable.interval(1000).take(10);
  let timer2 = Observable.interval(2000).take(10);
  let timer3 = Observable.interval(500).take(10);
  let concurrent = 2; // the argument
  let merged = Observable.merge(timer1, timer2, timer3, concurrent);
  merged.subscribe(x => console.log(x));
}


/**
 * 操作符用例-拦截事件模拟
 * 灰色的方框是用来转换 Stream 函数的。首先，简而言之，我们把连续 3000 ms 内的 Click 都积累到一个列表中（就是buffer(stream.throttle(3000ms) 做的事。
 * 不要在意这些细节，我们只是展示一下响应式编程而已)。结果是一个列表的 Stream ，然后我们使用 map() 把每个列表映射为一个整数，即它的长度。最终，
 * 我们使用 filter(x >= 2) 把整数 1 给过滤掉。就这样，3 个操作就生成了我们想要的 Stream。然后我们就可以订阅(“监听”)这个 Stream，并以我们所希望的方式作出反应
 */
function buffer1(){
  let click = Observable.interval(1000).timeInterval().take(10);
  let numbers2 = Observable.interval(1000);
  // buffer:throttle the events
  numbers2.buffer(click.throttle(ev => Observable.interval(3000)))
    .map(ev => ev.length)
    .filter(ev => ev >2)
    .subscribe(value => console.log('buffer:'+value));
}



function buffer2(){
  let click = Observable.interval(1000).timeInterval().take(10);
  let numbers2 = Observable.interval(1000);
  // buffer:throttle the events
  numbers2.buffer(click.throttle(ev => Observable.interval(2000)))
    .filter(ev => ev.length>2)
    .subscribe(value => console.log('buffer:'+value));
}
buffer2();




function fromPromise() {
  //var result = Observable.fromPromise(fetch('http://myserver.com/'));
  //result.subscribe(x => console.log(x), e => console.error(e));
}

//Scheduler调度者
function schedulersAsync(){
  let arr:Array<number> = [];
  for (var i=0; i<10; i++) {
    arr.push(i);
  }

  let timeStart = Date.now();

  Observable.from(arr,Scheduler.queue).subscribe(
    function onNext(value) {console.log('array:'+value)},
    function onError() {},
    function onCompleted() {
      console.log('Total time: ' + (Date.now() - timeStart) + 'ms');
    });
  console.log('hi,here');

}



function schedulersCurrentThread(){
  let scheduler = Scheduler.async;
  Observable.of(1000,scheduler).repeat().take(1)
    .subscribe(function(value) {
      console.log(value);
    });
}



