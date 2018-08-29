
$(document).ready(function(){

   $('a#btn-about').on('click', function() {
       $("#mini-tail").html('');
       $("#mini-tail").html('住所：鎌倉市<br /> 最寄り駅：鎌倉駅<br />');

   });

   $('a#btn-ref').on('click', function() {
        $("#mini-tail").html('');
//        $("#mini-tail").html('<div id="ref-section"><p><select id="aclist"><option value="0"></option><option value="1">0x1a000010</option><option value="2">0x1a000012</option><option value="3">0x1a0000a3</option><option value="4">0x1a0000c1</option><option value="5">0x1a0000d4</option></select></p><p class="amt">Amount:</p><a href="" class="ui-btn ui-corner-all" id="btn-submit">Send</a><p class="resp"></p><script src="https://code.jquery.com/jquery-1.11.1.min.js"></script><script src="/assets/as-lists.js"></script></div>');

      });

    $('a#btn-gangan').on('click', function() {
             $("#mini-tail").html('');
             $("#mini-tail").html('<h2>Gan-gan Zuda-dan</h2><br><div class="video"><iframe src="https://www.youtube.com/embed/YkJ-iDtoVas?&autoplay=1" frameborder="0" allowfullscreen></iframe></div>');
           });

    $('a#btn-account').on('click', function() {
            $("#mini-tail").html('');
            $("#mini-tail").html('<div id="account-section"><p>Choose one of your account(s):</p><p><select id="acclst" style="width: 50%;"></select></p><p class="acbalance">Balance:</p><a href="" class="ui-btn ui-corner-all" id="btn-get-account">Get Account List</a><a href="" class="ui-btn ui-corner-all" id="btn-get-balance">Get Balance</a><p class="resp"></p>   <script src="https://code.jquery.com/jquery-1.11.1.min.js"> </script><script src="/assets/as-lists.js"></script></div>');
    });
    $('a#btn-transaction').on('click', function() {
            $("#mini-tail").html('');
            $("#mini-tail").html('<div id="transaction-section"><h2>Transaction</h2>');
            $("#mini-tail").append('<label for="TranName">Transaction Name : </label><input type="text" name="TranName" id="tran_name" value="" placeholder="Type any favorite reference number." style="width: 75%;" class="ui-input-text ui-body-c ui-corner-all ui-shadow-inset">');
            $("#mini-tail").append('<label for="Value date">Value date : </label><input type="date" name="value_date" style="width: 75%;" id="value_date" class="ui-input-text ui-body-c ui-corner-all ui-shadow-inset">');
            $("#mini-tail").append('<label for="Amount">Amount : </label><input type="number" name="tran_amount" id="tran_amount" value="" placeholder="Type amount to be transferred." style="width: 75%;" class="ui-input-text ui-body-c ui-corner-all ui-shadow-inset">');
            $("#mini-tail").append('<label for="Currency" >Currency : </label><select name="currency" style="width: 50%;" id="currency"><option value="HRD">HRD</option></select>');
            $("#mini-tail").append('<label for="Account from" >From Account : </label><select name="account_from" style="width: 75%;" id="account_from"></select>');
            $("#mini-tail").append('<label for="Account to" >To Account : </label><select name="account_to" style="width: 75%;" id="account_to"></select>');
            $("#mini-tail").append('<label for="Email">Email : </label><input type="email" name="emailad" id="emailad" autocomplete="email" value="" placeholder="Type your email address." style="width: 75%;" class="ui-input-text ui-body-c ui-corner-all ui-shadow-inset">');
            $("#mini-tail").append('<label for="Remarks">Remarks : </label><textarea name="remarks" id="textarea-1"  placeholder="This is memo." class="ui-input-text ui-body-c ui-corner-all ui-shadow-inset"></textarea>');
            $("#mini-tail").append('<a href="" class="ui-btn ui-corner-all" id="btn-get-account2">Get Account List</a><a href="" class="ui-btn ui-corner-all" id="btn-tran-submit">Submit Transaction</a><p id="resp2"></p>');
            $("#mini-tail").append('<script src="https://code.jquery.com/jquery-1.11.1.min.js"></script><script src="/assets/as-lists.js"></script>');
            $("#mini-tail").append('</div>');

    });


});
