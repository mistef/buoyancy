var x,i,j,l,ll,selElmnt,a,b,c;const selectList=document.getElementById("selectList");for(i=0,l=(x=document.getElementsByClassName("custom-select")).length;i<l;i++){for(ll=(selElmnt=x[i].getElementsByTagName("select")[0]).length,(a=document.createElement("DIV")).setAttribute("class","select-selected"),a.innerHTML=selElmnt.options[selElmnt.selectedIndex].innerHTML,x[i].appendChild(a),(b=document.createElement("DIV")).setAttribute("class","select-items select-hide"),j=0;j<ll;j++)(c=document.createElement("DIV")).innerHTML=selElmnt.options[j].innerHTML,c.addEventListener("click",function(e){var t,s,n,r,o,d,m;for(s=0,d=(r=this.parentNode.parentNode.getElementsByTagName("select")[0]).length,o=this.parentNode.previousSibling;s<d;s++)if(r.options[s].innerHTML==this.innerHTML){for(r.selectedIndex=s,r.dispatchEvent(new Event("change")),o.innerHTML=this.innerHTML,m=(t=this.parentNode.getElementsByClassName("same-as-selected")).length,n=0;n<m;n++)t[n].removeAttribute("class");this.setAttribute("class","same-as-selected");break}o.click()}),b.appendChild(c);x[i].appendChild(b),a.addEventListener("click",function(e){e.stopPropagation(),closeAllSelect(this),this.nextSibling.classList.toggle("select-hide"),this.classList.toggle("select-arrow-active")})}function closeAllSelect(e){var t,s,n,r,o,d=[];for(n=0,t=document.getElementsByClassName("select-items"),s=document.getElementsByClassName("select-selected"),r=t.length,o=s.length;n<o;n++)e==s[n]?d.push(n):s[n].classList.remove("select-arrow-active");for(n=0;n<r;n++)d.indexOf(n)&&t[n].classList.add("select-hide")}document.addEventListener("click",closeAllSelect);