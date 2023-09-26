# vue2 diff算法

## 一、vue2的diff

### 1.认识diff

![diff策略](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/073469c0b647401fb3c18d4f195d844d~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp#?w=1162&h=834&e=png&b=fdfdfd)

#### [diff策略：]

通俗来讲就是通过某种策略找到新旧两种数据状况的不同来实现最小量更新的办法，其实diff的本质是希望实现最小量的更新，也就是说对于给定的两组新旧节点，他们的变化能够被diff策略察觉到，并且以尽可能小的代价去更新他们，而不是全部清除后，重新基于新的状态去创建。

#### [认知模型：]

对于现代前端框架都有这样的一个范式：UI = f(state)

也就是所谓的**状态驱动视图**，state即状态，f即框架，UI即用户看到的界面。基于这个范式，当用户更新了状态的时候，state的改变可以是全量的更改，但是UI并不一定会全量的更改。

我们可以举一个简单的例子，假设我们渲染了一个列表，用vue的方式表达是这样子的：

```vue
<script>
  const vm = new Vue({
    name: "App",
    template: `
    <div>
      <button @click="onChange">改变</button>
      <ul>
        <li v-for="item in list" :key="item">{{ item }}</li> 
      </ul>
    </div>
  `,
    data: {
      list: ["A", "B", "C", "D"],
    },
    methods: {
      onChange() {
        this.list = ["B", "A", "D", "C"];
      },
    },
  }).$mount("#app");
</script>
```

可以看到状态的改变是全量的，因为我状态我改变是通过在内存中创建了一个新的数组来实现的，但是列表的更新则不一定是全量的，因为那样太耗费性能量，diff就是致力于找出一种尽可能好的策略来满足这个需求，我们接下来就来细细剖析一下vue2的diff策略。

### 2.vue2的diff

我们现在可以来回顾一下vue2的diff是如何运作的，首先我们要在心中有一个明确的目标，知道我们的问题是什么，拿上面举过的例子来讲，我们的目标就是将 A B C D 变成 B A D C。

然后我们来看看vue2是怎么做的，它的源码在这里，我们先不看源码，先用一个流程来梳理一下思路，然后在对照源码进行确认，这样子循序渐进的过程可能会比较好一些，当我们将问题抽象成为这样一个模型的时候，就比较明确了：

我们需要写一个函数，入参是两个数组newArr以及oldArr，请将oldArr变为新的newArr，并在函数中体现调整策略。

我们准备几个变量：

![截屏2022-06-18 下午5.16.24.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/24562d8823bc4c95bded49fb5724a8c6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1360&h=1200&s=19952&e=webp&b=ffffff)

接下来开始我们的调整策略，调整的过程就是移动指针的过程：

**开启一个循环，循环的条件就是 oldStart 不能大于oldEnd ，newStart不能大于newEnd**

- 在每个循环单元中，我们执行下面的策略：

  - 分支0：遇到空，指针向右移动
  - 分支1：比较oldStart和newStart是否一致，如果一致，两个指针向右移动即可
  - 分支2：比较oldEnd和newEnd是否一致，如果一致，两个指针向左移动即可
  - 分支3：比较oldStart和newEnd是否一致，如果一致，就需要移动节点，**移动节点都针对old的操作，因为需要将old变成新的，所以会慢慢调整old朝着new去拟合**，将oldStart移动到oldEnd的下一个。
  - 分支4：比较newStart和oldEnd是否一致，如果一致，就需要移动节点，将oldEnd移动到oldStart的前一个。
  - 分支5：如果以上都没有命中，看看newStart是否在old中存在，如果存在，找到是第几个，假设是在old中的第i个位置，接下来将第i个位置的元素移动到oldStart的前一位，然后将当前第i位置空。如果不存在说明创建了一个新的元素，需要执行创建策略。

以上便是vue2的diff的核心流程了，我们通过一个例子再来感受一下，对于以下这样的调整目标来说：

![截屏2023-08-28 下午10.49.54.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e10a51729b574179a0b75871ac86d54f~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1148&h=826&s=50768&e=webp&b=fcfcfc)

**old**: A B C D  
**new**: B A D C

初始化：oldStart指向A，oldEnd指向D，newStart指向B，newEnd指向C。

`循环1:`

第一步：A不等于B ，且D不等于C 未命中分支1和2  
第二步：A不等于C ，且B不等于D 未命中分支3和4  
第三步：自动进入分支5，newStart在old中是否存在，在vue2中是这样判断的：

```arduino

//创建一个old的key和对应index的map表，在这个案例中就是：

const map = {
  A:0,
  B:1,
  C:2,
  D:3
}
```

newStart显然在map中存在，且index为1，所以根据策略，我们就需要将old中的第1位置的元素向oldStart的前一个移动，并且newStart向右移动。

第一轮循环结束：oldStart指向A，oldEnd指向D，newStart指向A，newEnd指向C

![截屏2023-08-28 下午10.52.32.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0701a1ac597c4eb18826fe55078ec3fa~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1286&h=814&s=53586&e=webp&b=fcfcfc)

`循环2:`

第一步：判断 A 等于 A，命中分支1，指针都向右移动。

第二轮循环结束：oldStart指向空，oldEnd指向D，newStart指向D，newEnd指向C

![截屏2023-08-28 下午10.55.17.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3c1a37f14171444db65616b7649d7c3d~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1204&h=814&s=53586&e=webp&b=fcfcfc)

`循环3:`

第一步：oldStart遇到空，命中分支0，指针向右移动，oldStart指向C。

第3轮循环结束；

![截屏2023-08-28 下午10.57.47.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8889a6427de8444ca75f8726e4a231c6~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1248&h=786&s=52626&e=webp&b=fcfcfc)

`循环4:`

第一步：判断 D不等于C，并且C不等于D，未命中分支1分支2。  
第二步：判断 C等于C，命中分支3，将oldStart向oldEnd下一个移动，oldStart++。

第4轮循环结束：oldStart指向D，oldEnd指向D，newStart指向A，newEnd指向C。

![截屏2023-08-28 下午11.02.15.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cf6793682f1143acbc69d6a7ee688146~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1494&h=846&s=57766&e=webp&b=fcfcfc)

`循环5:`

第一步：判断 D等于D ，命中分支1，指针向右移动，oldStart++。

第5轮循环结束：oldStart指向C，oldEnd指向D，newStart指向C，newEnd指向C。

![截屏2023-08-28 下午11.05.47.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ed85af5c7a744d3399a1f43d407e2434~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1404&h=832&s=58174&e=webp&b=fdfdfd)

这时候循环已经结束，因为oldStart已经大于oldEnd。

**实际上，我们可以看到，old已经在相对次序上和new一模一样了，虽然在数据结构上有两个空在那里，而实际上的DOM结构已经移动到了正确的位置上，空对应在DOM上就是什么都没有，所以这个移动是正确的**

### 3.源码分析

```js

function updateChildren(
    parentElm,
    oldCh,
    newCh,
    insertedVnodeQueue,
    removeOnly
) {
    let oldStartIdx = 0
    let newStartIdx = 0
    let oldEndIdx = oldCh.length - 1
    let newEndIdx = newCh.length - 1
    let oldKeyToIdx, idxInOld, vnodeToMove, refElm

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) { // 循环条件
      if (isUndef(oldStartVnode)) { // 排除空
        oldStartVnode = oldCh[++oldStartIdx] // 如果节点已经发生了移动会出现为undeifined的现象
      } else if (isUndef(oldEndVnode)) {// 排除空
        oldEndVnode = oldCh[--oldEndIdx]
      } else if (sameVnode(oldStartVnode, newStartVnode)) { // 分支1
        patchVnode(...) // 继续深度patch
        oldStartVnode = oldCh[++oldStartIdx]
        newStartVnode = newCh[++newStartIdx]
      } else if (sameVnode(oldEndVnode, newEndVnode)) { // 分支2
        patchVnode(...) // 继续深度patch
        oldEndVnode = oldCh[--oldEndIdx]
        newEndVnode = newCh[--newEndIdx]
      } else if (sameVnode(oldStartVnode, newEndVnode)) { // 分支3
        patchVnode(...)
        // 将oldStart对应的DOM移动到oldEnd对应DOM的下一个。
        nodeOps.insertBefore(
          parentElm,
          oldStartVnode.elm,
          nodeOps.nextSibling(oldEndVnode.elm)
        )
        ++oldStartIdx
        --newEndIdx
      } else if (sameVnode(oldEndVnode, newStartVnode)) { // 分支4
        patchVnode(...)
        // 将oldEnd对应的DOM移动到oldStart对应DOM的上一个。
        nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm)
        --oldEndIdx
        ++newStartIdx
      } else {
        if (发现了新的节点) {
          createElm(...) // 创建一个DOM节点
        } else { 
          vnodeToMove = oldCh[idxInOld] // 找到在old中对应的位置
          if (sameVnode(vnodeToMove, newStartVnode)) {  // 分支5
            patchVnode(...)
            oldCh[idxInOld] = undefined // 置空
            // 将old所在位置的DOM移动到oldStart所在DOM的上一个。
            nodeOps.insertBefore(
              parentElm,
              vnodeToMove.elm,
              oldStartVnode.elm
            )
          } 
        }
        ++newStartIdx
      }
    }
  }
```

上面是只展示了核心部分的代码，我们可以看到，基本逻辑和我们前面描述的是一样的。

## 二、算法模型

在前面我们主要讲述了vue2———diff算法的代码流程，接下来我会聊一下这个diff算法的心智模型，因为在大多数情况下我们不能满足于它的流程就可以了，最好我们能够知道它为什么可以解决问题。

**数据结构**

vue2底层的diff是基于vdom的，而vdom的数据结构是一颗多叉树，如果当前级的节点有多个，那么就是个数组，因此本质上就是比较两个数组的不同。而vue2的diff算法的目的其实不是找到他们不同的结果集，因为既然最终是为了让新的虚拟dom体现在界面上，那么索性在diff的过程中vue2就在不断的调整原来的dom树，使其慢慢变得跟新的一模一样。

> 上面可能理解起来有点抽象，我们举个现实世界中的例子：假设有一个间谍要伪装成一个人，潜入敌国偷取情报，所以他的目标就是要变的和`这个人`一模一样，他有两种方法一种是先找出他和这个人有哪些不同，没找到一个不同就拿个小本本记下来，这个寻找的过程可能需要一段时间，找完之后根据这个小本本一件件去调整，比如容貌不一样，就去整容；说话方式不一样就去练习；学历不一样就去伪造等等，这种方式我们叫做策略一。间谍觉得策略一不好，他不喜欢拿小本本记下来，他喜欢直接观察需要伪装的人，每找到一个不同，就立马调整伪装自己，直到自己和这个人完全一样为止，这种方式叫做策略二。
>
> 实际上vue系列用的都是策略二，在diff的过程中就直接调整自己（直接改变dom结构）然后基于新的vdom逐渐把dom调整的和新的vdom一致即可，所以diff一旦完成，也就完成了真正意义上dom的调整。

**心智模型**

vue2的diff是一种非常接近自然智慧的一种算法，本质上就是一种贪心策略，如果取一个比较贴近的名字，应该就叫做最左移策略，且听我一一来解释：

![截屏2023-08-28 下午10.49.54.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bba4a269cde04f2ebeef11b18acfff54~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=1148&h=826&s=50768&e=webp&b=fcfcfc)

我们还是来看一下上面这个图，如何让old变的和新的越来越像呢？我们使用自然智慧来思考，其实很容易可以想到一个策略就是：

我们不去管old了，我们就直接看new，然后用一个指针指向new的第一个节点，遍历new的每一个节点，然后每一次我都看一下new中的节点在old中的那一个位置，将这节点移动到oldStart的左侧。

用上面间谍的例子就是，我不去管我自己现在是什么样子，我就盯着那个需要我伪装的人，我从头到脚把他看一遍，看到头的时候，我发现我的脸和脸的头不一样，我去整个容，一样的部分就跳过，直到变得和他完全一样。

**优化**

但是可能细心的同学会说，他为什么vue2用了4个指针啊！

其实另外两个指针的目的是为了加速用的，想象一下假设newStart和oldEnd如果是一样的节点，如果没有oldEnd这个指针，那么newStart要从old中找到oldEnd，必须把old全部遍历一遍才能找到，而有了这个指针，则只需要O(1)的时间复杂度就可以直接找到这个节点，在diff的过程中可以大大提升diff的性能。
