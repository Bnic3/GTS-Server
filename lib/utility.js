/**
 * Created by john.nana on 7/9/2017.
 */

var nunjucks = require("nunjucks");

module.exports= function(){

    var tokenizer=()=>{
        var chars='0123456789ABCDEFGHIJKLMNPQRSTUVWXYZ',
        length= 6;
        var result = '';
        for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
        return result;
    };

    var usertokenizer=()=>{
        var chars='0123456789',
            length= 6;
        var result = '';
        for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
        return result;
    };

    var test= "John Wayne";


    var emailTemplate = ()=>{

        var html=` <!DOCTYPE html> <html lang="en"> <head> <meta charset="UTF-8"> <title></title>   </head> <body>   <div class="content"> <h2 class="red"> GTS Guest Log</h2> <div> <h4>Estate Name: {{estate}} </h4> <p>Duration: {{start}} - {{end}} </p> </div> <div class="datagrid"> <table class="table table-striped"> <thead> <tr> <th>#</th> <th>Host  </th> <th>Guest</th> <th>Guest Number</th> <th>Comment</th> <th>Date</th> </tr> </thead> <tbody> {% for item in items %} <tr>  <th scope="row">{{loop.index}}</th> <td>{{item.hostname}}</td> <td>{{item.guest}}</td> <td>{{item.guest_number}}</td> <td>{{item.comment}}</td> <td>{{item.date}}</td>   </tr>  {% else %} <li>No data to display at this moment</li> {% endfor %}   </tbody> </table> </div>  </div>  <style> .content{ display: flex; flex-flow: column wrap; padding: 5px 5px 5px 5px;  }  .table { width: 100%; max-width: 100%; margin-bottom: 1rem; background-color: transparent; } table { display: table; border-collapse: separate; border-spacing: 2px; border-color: grey; display: table; border-collapse: separate; border-spacing: 2px; border-color: grey;    }  thead { display: table-header-group; vertical-align: middle; border-color: inherit; }  body { display: table-row-group; vertical-align: middle; border-color: inherit; } tr { display: table-row; vertical-align: inherit; border-color: inherit; }  .table td, .table th { padding: .75rem; vertical-align: top; border-top: 1px solid #e9ecef; }  html { display: block; box-sizing: border-box; font-family: sans-serif; line-height: 1.15; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; -ms-overflow-style: scrollbar; -webkit-tap-highlight-color: transparent; }  body { margin: 0; font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif; font-size: 1rem; font-weight: 400; line-height: 1.5; color: #212529; background-color: #EEEEEE; }  thead { display: table-header-group; vertical-align: middle; border-color: inherit; }      th, td { text-align: left; padding: 8px; }  tr:nth-child(even){background-color: #E0E0E0}  th { background-color: #424242; color: white; }   </style>  </body>    </html>`;
        var data = [{ title: "foo", id: 1 }, { title: "bar", id: 2}];
        var data2 = [
            {

            "eid" : 27,
             hostname: "John Nana",
            "guest_number" : "+2348139208654",
            "guest" : "Abiodun MICHAEL. MHSS",
            "comment" : "Bad boy",
            "create_date" :  "2017-09-13T13:51:11.486+0000"

        },
            {

            "eid" : 27,
                hostname: "John Nana2",
            "guest_number" : "+2348139208654",
            "guest" : "Abiodun MICHAEL. MHSS",
            "comment" : "Bad guy",
            "create_date" :  "2017-09-13T15:33:01.987+0000"

            },
            {

            "eid" : 27,
                hostname: "John Nana3",
            "guest_number" : "+2348175173840",
            "guest" : "Adaeze",
            "comment" : "Admit 5 persons",
            "create_date" :  "2017-09-13T15:39:14.081+0000"

            }
        ]
        var res = nunjucks.renderString(html,{estate: "Ajah",start:"1", end:"2",items:data2});
        return res;




    }


    return {
            tokenizer: tokenizer,
            usertokenizer: usertokenizer,
            test:test,
            emalitemp:emailTemplate
    }
};
