$(document).ready(function(){
	var contactForm = $('#contactForm');
	var firstName = $('#firstName');
	var lastName = $('#lastName');
	var phoneNumber = $('#phoneNumber');
	var mailId = $('#mailId');
	var userAddress = $('#userAddress');
	var searchBox = $('#searchBox');
	var contactArea = $('.contact-area');
	var submitButton = $("#contactForm input[type='submit']");
	var contactList = JSON.parse(localStorage.getItem("contactobject"));
	var index = -1;
	var isEditing = false;
	if(contactList == null)
		contactList = [];
	var loadContact = function(){
		for(i=0;i<contactList.length;i++){
			var contact = contactList[i];
			createContact(contact,i);
		}
	}
	var addContact = function(event){
		if (event.isDefaultPrevented()) {
			return;
		}
		event.preventDefault();
		var contact = new Object();
		contact.firstName = firstName.val();
		contact.lastName = lastName.val();
		contact.phoneNumber = phoneNumber.val();
		contact.mailId = mailId.val();
		contact.userAddress = userAddress.val();
		if(isEditing){
			deleteContact();
			isEditing=false;

		}
		contactList.push(contact);
		contactList.sort(sortFunction);
		createContact(contact,contactList.indexOf(contact));
		contactForm[0].reset();
		submitButton.val("Add Contact");
	}
	var resetForm = function(){
		contactForm[0].reset();
		isEditing=false;
		submitButton.val("Add Contact");
	}
	var editContact = function(){
		if(isEditing){
			$("#warningModal").modal();
			return;
		}
		index = $(".single-contact").index($(this).closest(".single-contact"));
		var contact = contactList[index];
		$.each(contact,function(key,value){
			$("#"+key).val(value);
		})
		$(contactForm).validator('validate')
		isEditing=true;
		submitButton.val("Update Contact");
	}
	var deleteContact = function(){
		$("#removeModal").modal('hide');
		var contact = contactList[index];
		contactList.splice(index,1);
		$(".single-contact[data-name='"+contact.firstName+" "+contact.lastName+"']").remove();
		if(contactList.length == 0){
			$(".no-contact-info").removeClass("hidden");
		}
	}
	var deletePopup = function(){
		if(isEditing){
			$("#warningModal").modal();
			return;
		}
		index = $(".single-contact").index($(this).closest(".single-contact"));
		$("#removeModal").modal();
	}
	var sortFunction = function(contact1 , contact2){
		return contact1.firstName.toLowerCase().localeCompare(contact2.firstName.toLowerCase());

	}
	var createContact =  function(contact, position){
		$(".no-contact-info").addClass("hidden");
		var contactDiv = $('.single-contact:nth-child(1)').clone(true);
		contactDiv.attr("data-name",contact.firstName+" "+contact.lastName);
		$(contactDiv).removeClass("hidden");
		$(contactDiv).find(".first-name").html(contact.firstName);
		$(contactDiv).find(".last-name").html(contact.lastName);
		if(contact.mailId)
			$(contactDiv).find(".mail-text").html("Mail id : " + contact.mailId);
		else
			$(contactDiv).find(".mail-text").html("");
		if(contact.phoneNumber)
			$(contactDiv).find(".phone-text").html("Phone Number : " + contact.phoneNumber);
		else
			$(contactDiv).find(".phone-text").html("");
		if(contact.userAddress)
			$(contactDiv).find(".address-text").html("Address : " + contact.userAddress);
		else
			$(contactDiv).find(".address-text").html("");
		$(contactDiv).insertBefore(contactArea.find(".single-contact:nth-child("+(position+1)+")"));
	}
	loadContact();
	var searchContact = function(){
		var searchKey = $(this).val();
		$(".no-contact-info").addClass("hidden");
		for(i=1;i<contactArea.children().length-1;i++){
			var contact = contactArea.find(".single-contact:nth-child("+i+")");
			$(contact).removeClass("hidden");
			if(!contact.data('name').toLowerCase().includes(searchKey.toLowerCase())){
				$(contact).addClass("hidden");
				$(".no-contact-info").removeClass("hidden");
			}
		}
	}
	$(contactForm).validator().on("submit",addContact);
	$(contactForm).on("reset",resetForm);
	$(searchBox).on("keyup",searchContact)
	$(".remove-contact").click(deletePopup);
	$(".edit-contact").click(editContact);
	$("#confirmDelete").click(deleteContact);
	var saveObject = function(){
		localStorage.setItem('contactobject',JSON.stringify(contactList));
	}
	$(window).on("unload",saveObject);
});