$(document).ready(function(){
	var form = new FormViewController();
	form.init("#email-form-container");
});

/*GENERIC  VIEW CONTROLLER*/
(function(window){	
	function FormViewController(){
		this._form;
		this._view;
		this._formMessage;
		this._formMessageContainer;
		
		this.onSelectChange = function(e){
			var select = $(e.currentTarget);
			
			if(select.val() == "Other"){
				$("#other-location").removeClass("hidden");
				$("#other-location-label").removeClass("hidden");
			}else{
				$("#other-location").addClass("hidden");
				$("#other-location-label").addClass("hidden");
			}	
		}
		
		this.submitForm = function(a){
			var context = this;
			
			var select = $(this._form.find("select"));
			var locactionInput = $("#location-input"); 
			
			if(select.val() == "Other"){
				var otherInput = $("#other-location");
				
				if(otherInput.val() != ""){
					locactionInput.val(otherInput.val());
				}else{
					locactionInput.val(select.val());
				}
				
			}else{
				locactionInput.val(select.val());
			}
			
			this._formMessageContainer.show();
			
			$.ajax({
				type:"POST",
				data:this._form.serialize(),
				dataType:"json",
				url:"api/email/",
				success:function(data){
					console.log("data", data);
					context._formMessage.html(data.message);
					context._formMessage.css("margin-top", -context._formMessage.height() / 2);
					context.onFormSubmissionSuccess();
				},
				error: function(jqXHR, textStatus, errorMessage) {
					if( window.console ) console.log("error", errorMessage, textStatus, jqXHR);
				}
			});
		}
		
		this.onFormSubmissionSuccess = function(){
			this._form.find("input").each(function(){
				$(this).val("");
				
			});
			
			this._form.find("select").each(function(){
				$(this).val($(this).prop("defaultSelected"));
			})
			
			$("#other-location").addClass("hidden");
			$("#other-location-label").addClass("hidden");
			
			
			this._formMessageContainer.delay(3000).fadeOut();
		}
	}
	FormViewController.prototype = {
		init:function(target){
			var context = this;
			
			this._view = $(target);
			
			this._form = $(this._view.find("form"));
			this._formMessageContainer = $(this._view.find(".form-message"));
			this._formMessage = $(this._formMessageContainer.find("p"));
			this._formMessage.html("Sending your Email...");
			this._formMessage.css("margin-top", -this._formMessage.height() / 2);
			
			$(this._form.find("select")).on("change", function(e){ context.onSelectChange(e); });
			
			this._form.validate({
				rules: {
					name:"required",
					email:{
						required:true,
						email:true
					},
					link:{
						required:true,
						url:true
					}
				},
				messages:{
					email:{
						required:"Don't forget to enter your email address.",
						email:"Please enter a valid email address."
					},
					link:{
						required:"We won't know if it's Upworthy without a link.",
						url:"Please enter a valid url."
					}
				},
				submitHandler:function(form){
					context.submitForm();
				}
			});
			
		}
	}
	
	window.FormViewController = FormViewController;
}(window));
