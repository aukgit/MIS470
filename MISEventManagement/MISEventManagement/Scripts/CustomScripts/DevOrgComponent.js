// <reference path="../jquery-2.1.1.js" />
// <reference path="../jquery-2.1.1.intellisense.js" />
// <reference path="../bootstrap.js" />
// <reference path="../bootstrap-select.js" />
// <reference path="../bootstrap-datepicker.js" />
// <reference path="../bootstrap-datetimepicker.js" />

// <reference path="../underscore.js" />
// <reference path="DevOrgComponent.js" />

/*
 * Written by Alim Ul Karim
 * Developers Organism
 * https://www.facebook.com/DevelopersOrganism
 * mailto:info@developers-organism.com
*/
$(function () {


    $.fn.extend({
        // jQuery element get all classes
        getAllClasses: function () {
            if (this.length === 1) {
                return this.attr('class').split(/\s+/);
            }
            return null;
        }
    });


    $.devOrg = {
        // get all the classes from an jQuery element
        getAllClasses: function (jQueryHtmlElement) {
            return jQueryHtmlElement.getAllClasses();
        },

        // allClassesArray = ['a','b','c'] , exceptClassesArray=['b','c'], results=['a']
        getClassesExcept: function (allClassesArray, exceptClassesArray) {
            var len = allClassesArray.length;
            var results = [];
            for (var i = 0; i < len; i++) {
                if (exceptClassesArray.indexOf(allClassesArray[i]) === -1) {
                    // not found
                    results.push(allClassesArray[i]);
                }
            }
            return results;
        },
        // all Selectors are jQuery Selector Text  only.
        // selectpicker will be called inside function, no need to call outside.
        countryFlagRefresh: function (countrySelector, dropDownItemsSelector, dropDownBtnSelector) {
            var countryBox = $(countrySelector).selectpicker(); // only select a select element then apply the custom bootstrap selector
            var dropDownItems = $(dropDownItemsSelector); // getting generated dropdown items from the custom bootstrap selector
            var dropDownBtn = $(dropDownBtnSelector); // generated new button from the selectpicker option
            var skippingClassesAnchor = ["flag-country-combo", "flag"];
            var skippingClassesForBtn = ["btn", "dropdown-toggle", "selectpicker", "btn-success", "flag-combo"];

            // console.log(dropDownItems.length);
            countryBox.change(function (e) {
                var listItem = dropDownItems.find("li.selected");
                var anchorItem = listItem.find("a");
                var listOfAllAnchorClasses = anchorItem.getAllClasses();
                var listOfAllClassesdropDownBtn = dropDownBtn.getAllClasses();
                var flagClass = $.devOrg.getClassesExcept(listOfAllAnchorClasses, skippingClassesAnchor);
                var btnFlagClass = $.devOrg.getClassesExcept(listOfAllClassesdropDownBtn, skippingClassesForBtn);
                for (var i = 0; i < btnFlagClass.length; i++) {
                    dropDownBtn.removeClass(btnFlagClass[i]);
                }
                dropDownBtn.addClass("fc-" + flagClass[0]);
            });
        },
        // countryFlagRefresh must be called first or selectpicker must be called first
        // all Selectors are jQuery Selector Text  only.
        countryRelatedToPhone: function (countrySelector, dropDownItemsSelector, dropDownBtnSelector, phoneNumberInputSelector) {
            var countryBox = $(countrySelector);
            var dropDownItems = $(dropDownItemsSelector);
            var dropDownBtn = $(dropDownBtnSelector);
            var phoneNumberBox = $(phoneNumberInputSelector);
            var previousCallingCode = "";

            countryBox.ready(selectChangeState).change(selectChangeState);
            //phoneNumberBox.keyup(selectChangeState);
            // $("#selectID option")[index].selected = true;
            function selectChangeState() {
                // console.log("executed");
                var listItem = dropDownItems.find("li.selected");
                var spanText = listItem.find("a>span").text().toString();
                var newCallingCode = $.devOrg.getTextBetween(spanText, '(', ')');
                var getWrittenPhoneNumber = phoneNumberBox.val();
                // console.log(listItem);
                newCallingCode = $.devOrg.replaceStartsWith(newCallingCode, '+', '');
                if ((!_.isEmpty(getWrittenPhoneNumber) && !_.isEmpty(previousCallingCode))
                    && $.devOrg.isStartsWith(getWrittenPhoneNumber, previousCallingCode)) {
                    getWrittenPhoneNumber = $.devOrg.replaceStartsWith(getWrittenPhoneNumber, previousCallingCode, newCallingCode);
                } else {
                    getWrittenPhoneNumber = newCallingCode + getWrittenPhoneNumber;
                }
                previousCallingCode = newCallingCode;
                phoneNumberBox.val(getWrittenPhoneNumber);
            }
        },

        getTextBetween: function (givenString, startSequence, endingSequence) {
            if (_.isString(givenString)) {
                var index1 = givenString.indexOf(startSequence);
                if (index1 > -1) {
                    var index2 = givenString.indexOf(endingSequence);
                    if (index2 > -1) {
                        // exist
                        return givenString.substr(index1 + 1, index2 - index1 - 1);
                    }
                }
            }
            return null;
        },
        // parentjQueryCombo = passJqueryElement , mainDivContainerSelector = ".something-main", innerDivSelectorForPlacingCombo= ".somthing-combo-div"
        // it would be better to execute parentjQueryCombo as selectpicker or have a selectpicker class.
        // No combo will appear , even the main div will disappear if no item is received from the link.
        // json sender should sends as id and text only.
        smartDependableCombo: function (parentjQuerySelector, mainDivContainerSelector, innerDivSelectorForPlacingCombo, urlToGetJson, placeComboName, placedComboId, placedComboClass, placedComboAdditionalClassesWithItems, placedComboAdditionalHtmlWithEachItem) {
            var parentjQueryCombo = $(parentjQuerySelector);
            if (_.isEmpty(parentjQueryCombo)) {
                console.error.log("error raised from developers organism component's smartDependableCombo that no parent is detected.");
                return; // nothing exist in parent.
            }
            var mainDiv = $(mainDivContainerSelector);
            var innerDiv = mainDiv.find(innerDivSelectorForPlacingCombo);
            _hideDiv();
            parentjQueryCombo.change(function () {
                var parentComboValue = parentjQueryCombo.val();
                var actualUrl = urlToGetJson + "/" + parentComboValue;
                $.ajax({
                    type: "POST",
                    dataType: "JSON",
                    url: actualUrl,
                    success: function (response) {
                        if (response.length === 0) {
                            _hideDiv();
                            return;
                        }
                        innerDiv = $(mainDivContainerSelector + " " + innerDivSelectorForPlacingCombo);
                        // items exist.
                        _showDiv(); //remove inner options if exist any
                        _createCombo(response); // create if necessary and then append options to it.
                    },
                    error: function (xhr, status, error) {
                        _hideDiv();
                    }
                });
            });
            function _hideDiv() {
                if (mainDiv.length > 0) {
                    mainDiv.hide();
                } else {
                    console.error.log("devOrg->smartDependableCombo: main div not found for '" + mainDivContainerSelector + "'");
                }
            }


            function _showDiv() {
                // remove select if exist.
                var options = innerDiv.find("select, div.bootstrap-select");
                if (options.length > 0) {
                    options.remove();
                }
                mainDiv.show("slow");
            }

            function _createCombo(response) {
                if (!_.isEmpty(placedComboId)) {
                    placedComboId = " id='" + placedComboId + "' ";
                } else {
                    placedComboId = "";
                }
                if (_.isEmpty(placedComboClass)) {
                    placedComboClass = "";
                }

                if (_.isEmpty(placeComboName)) {
                    placeComboName = "";
                } else {
                    placeComboName = " name='" + placeComboName + "' "
                }


                innerDiv.prepend("<select " + placeComboName + " class='devOrgSmartCombo form-control " + placedComboClass + " selectpicker'" + placedComboId + "data-style='" + placedComboClass + "' data-live-search='true'></select>");
                combo = innerDiv.find("select");
                $.devOrg.appenedComboElement(combo, response, placedComboAdditionalHtmlWithEachItem, placedComboAdditionalClassesWithItems);
                combo.selectpicker();
            }
        },
        // listOfItems = expected a json item with id and text property
        // extraHtmlWithEachElement : represents like below
        // <option .. > extraHtmlWithEachElement Item </option>
        appenedComboElement: function (combo, listOfItems, extraHtmlWithEachElement, itemClasses) {
            // followed by the best practice : http:// allthingscraig.com/blog/2012/09/28/best-practice-appending-items-to-the-dom-using-jquery/
            if (_.isEmpty(itemClasses)) {
                itemClasses = "";
            }
            if (_.isEmpty(extraHtmlWithEachElement)) {
                extraHtmlWithEachElement = "";
            }
            if (listOfItems.length > 0) {
                var length = listOfItems.length;
                var options = "";
                var selected = " Selected='selected' "
                var optionStarting = "<option class='devorgCombo-item " + itemClasses + "'";
                var optionEnding = "</option>";
                for (var i = 0; i < length; i++) {
                    if (i == 0) {
                        selected = "";
                    }
                    options += optionStarting + selected + "value='" + listOfItems[i].id + "'>" + extraHtmlWithEachElement + listOfItems[i].text + optionEnding;
                }
                combo.append(options);
            }
        },
        bootstrapComboSelectbyFindingValue: function (comboSelector, searchForvalue) {
            $(comboSelector).selectpicker('val', searchForvalue).trigger('change');
        },
        bootstrapComboSelectIndex: function (comboSelector, index) {
            var combo = $(comboSelector + ">option");
            if (combo.length > 0 && index <= (combo.length - 1)) {
                
                var itemFound = $(combo[index]);                
                var value = itemFound.val();
                $.devOrg.bootstrapComboSelectbyFindingValue(comboSelector, value);
            }
        },

        // givenString "Example ( Hello )" 
        // startsWith= "Example" ; returns true.
        isStartsWith: function (givenString, startsWith) {
            if (_.isString(givenString)) {
                var subtringOfGiventext = givenString.substr(0, startsWith.length);
                if (subtringOfGiventext === startsWith) {
                    return true;
                }
            }
            return false;
        },

        replaceStartsWith: function (givenString, findStartsWith, replaceString) {
            if (_.isString(givenString) && !_.isEmpty(findStartsWith)) {
                var subtringOfGiventext = givenString.substr(0, findStartsWith.length);
                if (subtringOfGiventext === findStartsWith) {
                    var nextStringIndex = findStartsWith.length;
                    var otherHalftext = givenString.substr(nextStringIndex, givenString.length - nextStringIndex);
                    return replaceString + otherHalftext;
                }
            }
            return givenString;
        },

        // jquery formSelector, submitAtLast:true/false
        enterToNextTextBox: function (formSelector, submitAtLast) {
            $(formSelector + ' input:text:first').focus();
            var binders = formSelector + " input[type='text']:visible," +
                          formSelector + " input[type='password']:visible," +
                          formSelector + " input[type='numeric']:visible," +
                          formSelector + " input[type='email']:visible," +
                          formSelector + " button.selectpicker[type='button']:visible," +
                          formSelector + " select:visible";
            $(document).on('keypress', binders, function (e) {
                // var codeAbove = d.keyCode || d.which;
                // console.log("above code :" + codeAbove);
                var code = e.keyCode || e.which;
                // console.log("inside code :" + code);
                if (code == 13) { // Enter key
                    e.preventDefault(); // Skip default behavior of the enter key
                    var n = $(binders).length;
                    var nextIndex = $(binders).index(this) + 1;
                    if (nextIndex < n) {
                        $(binders)[nextIndex].focus();
                    } else {
                        $(binders)[nextIndex - 1].blur();
                        if (submitAtLast === true) {
                            $(formSelector).submit();
                        }
                    }
                }
            });
        },
        // validate("#LogName", "/Validation/username", "username");
        validateForm: function (textBox, ValidationLink, validatorNameTemp, focusIfNotValid, disabled, minChars, invalidStatementInCrossMark, validStatementInCheckMark) {
            var userTextbox = $(textBox);
            if (userTextbox.length > 0) {
                userTextbox.removeAttr("disabled");
                userTextbox.keyup(function () {
                    $("#validation #id").val(userTextbox.val());
                    // console.log(user);
                }).focus(function () {
                    $("#validation #id").val(userTextbox.val());
                    // console.log(user);
                }).blur(function () {
                    $("#validation #id").val(userTextbox.val());
                    var passingText = userTextbox.val();
                    if (_.isEmpty(passingText) || passingText.length < minChars) {
                        // if empty text then don't send.
                        return;
                    }
                    if (_.isEmpty(validStatementInCheckMark)) {
                        validStatementInCheckMark = "is available and valid.";
                    }
                    if (_.isEmpty(invalidStatementInCrossMark)) {
                        invalidStatementInCrossMark = "is not valid or already exist. Your input can't contain ( [ ] ' , * & ? \" ) or space or any other special character for this data-type.";
                    }

                    // Validation should be a form underlying the original from with 
                    // only antiforgery token and a hidden id field
                    // whatever is typed in that selected text box will be pushed into
                    // this form
                    var form = $("#validation").serialize();
                    var validatorName = "span.CustomValidation." + validatorNameTemp;
                    var token = $('input[name=__RequestVerificationToken]').val();
                    var processingState1 = "glyphicon-refresh";
                    var processingState2 = "glyphicon-refresh-animate";
                    var isHideClass = "hide";
                    var colorGreen = "green";
                    var colorRed = "red";
                    var correctState = "glyphicon-ok";
                    var incorrectState = "glyphicon-remove";
                    var validatorBox = $(validatorName);
                    var displayName = validatorBox.attr('data-display');
                    var correctStateTitle = displayName + " " + validStatementInCheckMark;

                    var incorrectStateTitle = displayName + " " + invalidStatementInCrossMark;
                    var tooltipName = "a.CustomValidation." + validatorNameTemp + ".tooltip-show";
                    var tooltipBox = $(tooltipName);

                    // console.log($("#validation #id").val());
                    validatorBox.removeClass(incorrectState).removeClass(correctState);


                    // if no processing state then add it
                    if (!validatorBox.hasClass(processingState1)) {
                        validatorBox.addClass(processingState1);
                    }

                    if (!validatorBox.hasClass(processingState2)) {
                        validatorBox.addClass(processingState2);
                    }
                    if (validatorBox.hasClass(isHideClass)) {
                        validatorBox.removeClass(isHideClass);
                    }
                    tooltipBox.attr("data-original-title", "Validating " + displayName)
                              .attr("title", "Validating " + displayName);
                    // confirming processing state.


                    $.ajax({
                        type: "POST",
                        dataType: "JSON",
                        url: ValidationLink,
                        data: form,
                        success: function (response) {
                            // Remove the processing state
                            if (validatorBox.hasClass(processingState1)) {
                                validatorBox.removeClass(processingState1);
                            }

                            if (validatorBox.hasClass(processingState2)) {
                                validatorBox.removeClass(processingState2);
                            }
                            if (validatorBox.hasClass(isHideClass)) {
                                validatorBox.removeClass(isHideClass);
                            }
                            // Remove the processing state
                            if (response == true) {
                                if (validatorBox.hasClass(incorrectState)) {
                                    validatorBox.removeClass(incorrectState);
                                }
                                if (validatorBox.hasClass(colorRed)) {
                                    validatorBox.removeClass(colorRed);
                                }
                                validatorBox.addClass(colorGreen)
                                            .addClass(correctState)
                                            .attr('title', correctStateTitle);

                                tooltipBox.attr("title", correctStateTitle)
                                          .attr("data-original-title", correctStateTitle);
                                if (disabled) {
                                    userTextbox.prop("disabled", true);
                                }

                                userTextbox.addClass("bold")
                                            .addClass("green")
                                            .next()
                                            .focus();


                            } else {
                                if (validatorBox.hasClass(colorGreen)) {
                                    validatorBox.removeClass(colorGreen);
                                }
                                if (validatorBox.hasClass(correctState)) {
                                    validatorBox.removeClass(correctState);
                                }
                                userTextbox.prop("disabled", false)
                                            .addClass("bold")
                                            .addClass("red");

                                validatorBox.addClass(colorRed)
                                            .addClass(incorrectState)
                                            .attr('title', incorrectStateTitle);

                                tooltipBox.attr("title", incorrectStateTitle)
                                          .attr("data-original-title", incorrectStateTitle);
                                if (focusIfNotValid === true) {
                                    userTextbox.focus();
                                }
                            }
                            $(".tooltip-show").tooltip();

                        },
                        error: function (xhr, status, error) {
                            // Remove the processing state
                            if (validatorBox.hasClass(processingState1)) {
                                validatorBox.removeClass(processingState1);
                            }

                            if (validatorBox.hasClass(processingState2)) {
                                validatorBox.removeClass(processingState2);
                            }
                            if (validatorBox.hasClass(isHideClass)) {
                                validatorBox.removeClass(isHideClass);
                            }
                            // Remove the processing state
                            if (validatorBox.hasClass(correctState)) {
                                validatorBox.removeClass(correctState);
                            }

                            if (validatorBox.hasClass(colorGreen)) {
                                validatorBox.removeClass(colorGreen);
                            }
                            userTextbox.prop("disabled", false)
                                       .addClass("bold")
                                       .addClass("red");

                            validatorBox.addClass(colorRed)
                                        .addClass(incorrectState)
                                        .attr('title', error);

                            tooltipBox.attr("title", status)
                                      .attr("data-original-title", error);

                            $(".tooltip-show").tooltip();

                        }
                    }); // ajax end
                });
            };// if else end
        },


        fillRegisterFieldsOnDemo: function () {
            var i = 0;
            var controls = $(".form-group");
            $fields = controls.find("input[type=text]");
            $.each($fields, function () {
                this.value = 1111111111111;
            });

            $fields = controls.find("input[type=password]");
            $.each($fields, function () {
                this.value = "asdf1234@";
            });


            $fields = controls.find("input[type=number]");
            $.each($fields, function () {
                this.value = i++;
            });

            $fields = controls.find("textarea");
            $.each($fields, function () {
                this.value = "1111111111111";
            });

            $fields = controls.find("input[type=email]");
            $.each($fields, function () {
                this.value = "auk.junk@live.com";
            });

            $fields = controls.find("input[type=checkbox]");
            $.each($fields, function () {
                this.prop("checked", true)
            });

        },
        //'.make-it-tab'
        bootstrapTabsMordernize: function (tabSelector) {
            var bootstrapTabs = $(tabSelector);
            if (bootstrapTabs.length > 0) {
                var tabHidden = $(".tab-content input[type='hidden'][name='tab']");

                if (tabHidden.length > 0) {
                    var tabHiddenValue = tabHidden.val();
                    if (!_.isEmpty(tabHiddenValue)) {
                        //tab name exist
                        bootstrapTabs.find("li>a[href='" + tabHiddenValue + "']").tab('show');
                    } else {
                        //no tab name exist.. select default one.
                        bootstrapTabs.find("li>a:first").tab('show');
                    }
                }

                bootstrapTabs.click(function (e) {
                    //e.preventDefault();                    
                    e.preventDefault();
                    $(this).tab('show');

                });

                $("ul" + tabSelector + ".nav-tabs > li > a").on("shown.bs.tab", function (e) {
                    var valueOfActive = $(e.target).attr("href");
                    // = $(tabSelector + " li.active>a").attr('href');
                    tabHidden.val(valueOfActive);
                    //window.location.hash = id;
                });
            }
        },
        ratingMordernize: function () {
            var ratingItems = $(".rating-5");

            if (ratingItems.length > 0) {
                ratingItems.rating({
                    showClear: false
                });
            }
            ratingItems = $(".rating-10");

            if (ratingItems.length > 0) {
                ratingItems.rating({
                    showClear: false,
                    starCaptionClasses: {
                        0.5: 'label label-danger',
                        1: 'label label-danger',
                        1.5: 'label label-danger',
                        2: 'label label-danger',
                        2.5: 'label label-danger',
                        2: 'label label-warning',
                        2.5: 'label label-warning',
                        3: 'label label-warning',
                        3.5: 'label label-warning',
                        4: 'label label-warning',
                        4.5: 'label label-warning',
                        5: 'label label-warning',
                        5.5: 'label label-info',
                        6: 'label label-info',
                        6.5: 'label label-info',
                        7: 'label label-info',
                        7.5: 'label label-primary',
                        8: 'label label-primary',
                        8.5: 'label label-success',
                        9: 'label label-success',
                        9.5: 'label label-success',
                        10: 'label label-success'
                    }
                });
            }
        },
        // jQueryformSelector = ".form-reg,form"
        // keepOthersVisible = true/false. Slide each div based [data-dev-slide='number-zero-based'][data-dev-visited='false']
        uxFriendlySlide: function (jQueryformSelector, keepOthersVisible) {
            var slideObjects = $(jQueryformSelector + " [data-dev-slide][data-dev-visited='false']");
            var executedOnce = false;
            var binders = "input[type='text']:visible," +
                          "input[type='password']:visible," +
                          "input[type='email']:visible," +
                          "input[type='numeric']:visible," +
                          "select:visible";
            var order = 0;
            var totalSliderLength = slideObjects.length;
            var previousSlideNumber = 0;
            if (totalSliderLength > 0) {
                // exist slides.
                slideObjects.hide();
                previousSlideNumber = order;
                slideObjects.filter("[data-dev-slide='" + (order++) + "'][data-dev-visited='false']").show();
                $(jQueryformSelector).submit(function (e) {
                    e.preventDefault();

                    var nextOne = slideObjects.filter("[data-dev-slide='" + order + "'][data-dev-visited='false']");
                    // if (nextOne.length == 0) {
                    //    for (order += 1; nextOne.length == 0 && totalSliderLength >= order; order++) {
                    //        nextOne = slideObjects.filter("[data-dev-slide='" + order + "'][data-dev-visited='false']");
                    //    }
                    // }
                    if (nextOne.length > 0) {
                        var previousOne = slideObjects.filter("[data-dev-slide='" + (order - 1) + "']");
                        // console.log(previousOne);
                        var inputBoxes = previousOne.find("input");
                        // still exist , prevent submission
                        if (inputBoxes.length > 0 && $.devOrg.checkValidInputs(inputBoxes)) {
                            if (!keepOthersVisible) {
                                previousOne.hide("slow");
                            }
                            //console.log(inputBoxes);
                            //console.log(binders);
                            if (!nextOne.prop("data-dev-visited")) {
                                nextOne.attr("data-dev-visited", "true");
                                nextOne.show("slow");
                                console.log(nextOne);
                                order++;
                            }
                        } else {
                            //console.log("no inboxes");
                        }

                    } else {
                        // nothing left.
                        // sttil check the validation.
                        var previousOne = slideObjects.filter("[data-dev-slide='" + (order - 1) + "']");
                        // console.log(previousOne);
                        var inputBoxes = previousOne.find("input");
                        if (inputBoxes.length > 0 && $.devOrg.checkValidInputs(inputBoxes)) {
                            this.submit();
                        }
                    }


                });

                // var notVisited = slideObjects.filter("[data-dev-visited='false']");
            }
        },
        // Send inputs array, if any of those false , returns false.
        checkValidInputs: function (jBinders) {
            var length = jBinders.length;
            if (length > 0) {
                for (var i = 0; i < length; i++) {
                    if (!$(jBinders[i]).valid()) {
                        return false;
                    }
                }
            }
            return true;
        }
    };
});