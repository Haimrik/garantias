var defaultGarantee = [{
    value: "titulopublico",
    icon: "assets/img/pallace.png",
    role: 'default',
    position: 'center',
    titles: 'Título Público (selic)'
  },
  {
    value: "tituloprivado",
    icon: "assets/img/building.png",
    role: 'default',
    position: 'center',
    titles: "Título Privado"
  },
  {
    value: "ouro",
    icon: "assets/img/gold.png",
    role: 'default',
    position: 'center',
    titles: "Ouro"
  },
  {
    value: "acoes",
    icon: "assets/img/graph.png",
    role: 'default',
    position: 'first',
    titles: 'Ações'
  },
  {
    value: "especie",
    icon: "assets/img/money.png",
    role: 'default',
    position: 'center',
    titles: "Valor em espécie"
  },
  {
    value: "cartafianca",
    icon: "assets/img/letter.png",
    role: 'default',
    position: 'center',
    titles: 'Carta fiança'
  },
];
var defaultBlacklist = [{
    value: "inoa3",
    icon: "",
    role: 'default',
    position: 'first',
    titles: "INOA3"
  },
  {
    value: "inoa4",
    icon: "",
    role: 'default',
    position: 'first',
    titles: "INOA4"
  },
  {
    value: "petr3",
    icon: "",
    role: 'default',
    position: 'first',
    titles: "PETR3"
  },
];
var clientGarantee = [{
    value: "inoa3",
    icon: "",
    role: 'user',
    position: 'first',
    titles: 'INOA3'
  },
  {
    value: "especie",
    icon: "assets/img/money.png",
    role: 'user',
    position: 'first',
    titles: 'Valor em espécie'
  },
  {
    value: "ouro",
    icon: "assets/img/gold.png",
    role: 'user',
    position: 'end',
    titles: 'Ouro'
  },
];
var clientBlacklist = [{
  value: "inoa4",
  icon: "",
  role: 'user',
  position: 'end',
  titles: "INOA4"
}]
var actives = [{
    value: "titulopublico",
    icon: "assets/img/pallace.png",
    role: 'user',
    position: 'end',
    titles: 'Título Público (selic)'
  },
  {
    value: "tituloprivado",
    icon: "assets/img/building.png",
    role: 'user',
    position: 'end',
    titles: 'Título Privado'
  },
  {
    value: "ouro",
    icon: "assets/img/gold.png",
    role: 'user',
    position: 'end',
    titles: 'Ouro'
  },
  {
    value: "acoes",
    icon: "assets/img/graph.png",
    role: 'user',
    position: 'end',
    titles: 'Ações'
  },
  {
    value: "especie",
    icon: "assets/img/money.png",
    role: 'user',
    position: 'end',
    titles: 'Valor em espécie'
  },
  {
    value: "cartafianca",
    icon: "assets/img/letter.png",
    role: 'user',
    position: 'end',
    titles: 'Carta fiança'
  },
  {
    value: "inoa2",
    icon: "",
    role: 'user',
    position: 'end',
    titles: 'INOA2'
  },
  {
    value: "inoa3",
    icon: "",
    role: 'user',
    position: 'end',
    titles: 'INOA3'
  },
  {
    value: "inoa4",
    icon: "",
    role: 'user',
    position: 'end',
    titles: 'INOA4'
  },
  {
    value: "petr3",
    icon: "",
    role: 'user',
    position: 'end',
    titles: 'PETR3'
  },
  {
    value: "petr4",
    icon: "",
    role: 'user',
    position: 'end',
    titles: 'PETR4'
  },
];
var clientAlternativeDefault = [];
var accentMap = {
  "á": "a",
  "é": "e",
  "í": "i",
  "ó": "o",
  "ú": "u",
  "ã": "a",
  "õ": "o",
  "ö": "o",
  "ç": "c"
};
var clientsList = [{
    id: "user",
    garantee: clientGarantee,
    blacklist: clientBlacklist,
    default: defaultGarantee,
    value: "Henrique"
  },
  {
    id: "default",
    garantee: defaultGarantee,
    blacklist: defaultBlacklist,
    default: defaultGarantee,
    value: "Default"
  }
];
// Normalize accents to the filter
var normalize = function(term) {
  var ret = "";
  for (var i = 0; i < term.length; i++) {
    ret += accentMap[term.charAt(i)] || term.charAt(i);
  }
  return ret;
};
var renderedClientCards = [];
var renderedClientDefaultCards = [];
var clickedButton;
var cardOrigin;
$(document).ready(function() {
  $(".content-container").addClass("default");
  renderDefault();
  // Clients name autocomplete
  $("#clientId").autocomplete({
    minLength: 0,
    source: function(request, response) {
      var matcher = new RegExp("^" + $.ui.autocomplete.escapeRegex(request.term), "i");
      response($.grep(clientsList, function(value) {
        value = value.value || value;
        return matcher.test(value) || matcher.test(normalize(value));
      }));
    },
    focus: function(event, ui) {
      // $( "#clientId" ).val( ui.item.value );
      return false;
    },
    select: function(event, ui) {
      $("#clientId").val(ui.item.value);
      changeClient();
      $("#clientId").attr('size', $("#clientId").val().length);
      return false;
    }
  });
  $('#clientId').bind('keyup change', function() {
    $(this).attr('size', this.value.length);
  }).trigger('keyup');
  // $("#clientId").change(function() {
  //   changeClient();
  // });
  // Starting the sortable lists of garantees
  $("#garantee-list").sortable({
    items: ".card:not(.ui-state-disabled):not(:last-child)",
    revert: true,
    connectWith: ".connectedSortable",
    placeholder: "ui-state-highlight",
    update: function() {
      let temporaryList = [];
      $("#garantee-list").find(".card:not(.addCard)").each(function() {
        let object;
        if ($("#clientId").val().toLowerCase() == "default") {
          object = {
            value: $(this).find(".value").val(),
            icon: $(this).find("img").attr('src'),
            role: 'default',
            position: $(this).find(".position").val(),
            titles: $(this).find(".titles").val()
          };
        } else {
          object = {
            value: $(this).find(".value").val(),
            icon: $(this).find("img").attr('src'),
            role: 'user',
            position: $(this).find(".position").val(),
            titles: $(this).find(".titles").val()
          };
        }
        if ($(this).find(".title").text() != "" && $(this).find("img").attr('src') != "")
          temporaryList.push(object);
      });
      if ($("#clientId").val().toLowerCase() == "default") {
        defaultGarantee = temporaryList;
        clientsList[1].garantee = temporaryList;
      }
    },
    start: function(event, ui) {
      ui.item.startPos = ui.item.index();
      draggedCard = ui.item;
      cardOrigin = $('#' + draggedCard[0].id).closest('.containerList').attr('id');
    },
    stop: function(event, ui) {
      let startPosition = ui.item.startPos;
      let endPosition = ui.item.index();
      if (getActiveUser().value == "Henrique" && (startPosition !== endPosition)) {
        let startPositionObject;
        let endPositionObject;
        let startPositionValue;
        let endPositionValue;
        let startPositionId;
        let endPositionId;
        startPositionObject = draggedCard[0];
        if ($('#' + startPositionObject.id).closest('.containerList').attr('id') == 'blacklistContainer') {
          let removeCardIndex = clientGarantee.findIndex(el => el.value == startPositionObject.id);
          clientGarantee.splice(removeCardIndex, 1);
        } else {
          if (startPosition < endPosition) {
            startPositionId = startPositionObject.id;
            startPositionValue = $(startPositionObject).find('.position').val();
            endPositionObject = $(" #garantee-list .card:nth-child(" + endPosition + ") ")[0];
            endPositionId = $(" #garantee-list .card:nth-child(" + ui.item.index() + ") ")[0].id;
            endPositionValue = $(endPositionObject).find('.position').val();
          } else {
            startPositionObject = draggedCard[0];
            startPositionId = startPositionObject.id;
            startPositionValue = $(startPositionObject).find('.position').val();
            endPositionObject = $(" #garantee-list .card:nth-child(" + endPosition + 2 + ") ");
            endPositionId = $(" #garantee-list .card:nth-child(" + Number(ui.item.index() + 2) + ") ")[0].id;
            endPositionValue = $(" #garantee-list .card:nth-child(" + Number(ui.item.index() + 2) + ") ").find('.position').val();
          }
          if ((startPositionValue == 'first' && endPositionValue == 'first') || (startPositionValue == 'end' && endPositionValue == 'end')) {
            swapPosition(renderedClientCards, startPositionId, endPositionId, startPosition, endPosition);
          } else {
            if (startPositionValue == 'first' && endPositionValue == 'end') {
              $(draggedCard[0]).find('.position').attr('value', 'end');
              let objIndex = renderedClientCards.findIndex((obj => obj.value == draggedCard[0].id));
              renderedClientCards[objIndex].position = 'end';
              clientGarantee[objIndex].position = 'end';
              swapPosition(renderedClientCards, startPositionId, endPositionId, startPosition, endPosition);
            } else if (startPositionValue == 'end' && endPositionValue == 'first') {
              $(draggedCard[0]).find('.position').attr('value', 'first');
              let objIndex = renderedClientCards.findIndex((obj => obj.value == draggedCard[0].id));
              renderedClientCards[objIndex].position = 'first';
              // clientGarantee[objIndex].position = 'first';
              swapPosition(renderedClientCards, startPositionId, endPositionId, startPosition, endPosition);
            } else {
              let positionToAddCardId = '';
              let realPosition = 0;
              for (i = 0; i < renderedClientCards.length; i++) {
                if (renderedClientCards[i].position == 'end') {
                  positionToAddCardId = renderedClientCards[i].value;
                  break;
                }
              }
              let filteredElement = clientGarantee.filter(el => el.value == startPositionObject.id);
              currentPosition = (clientGarantee.findIndex(el => el.value == startPositionObject.id));
              if ($(startPositionObject).find('.position').val() == 'first') {
                clientGarantee[currentPosition].position = 'end';
                realPosition = (clientGarantee.findIndex(el => el.value == positionToAddCardId));
                clientGarantee = (array_move(clientGarantee, currentPosition, realPosition - 1));
              } else {
                clientGarantee[currentPosition].position = 'first';
                realPosition = (clientGarantee.findIndex(el => el.value == positionToAddCardId));
                clientGarantee = (array_move(clientGarantee, currentPosition, realPosition));
              }
            }
          }
        }
        update_renderedClientCards();
      }
    }
  });
  $("#garantee-list").children().disableSelection();
  $("#blacklist").sortable({
    items: ".card:not(.ui-state-disabled):not(:last-child)",
    revert: true,
    connectWith: ".connectedSortable",
    placeholder: "ui-state-highlight",
    update: function() {
      let temporaryList = [];
      $("#blacklist").find(".card:not(.addCard)").each(function() {
        let object;
        if ($("#clientId").val().toLowerCase() == "default") {
          object = {
            value: $(this).find(".value").val(),
            icon: $(this).find("img").attr('src'),
            role: $(this).find(".role").val(),
            position: $(this).find(".position").val(),
            titles: $(this).find(".titles").val()
          };
        } else {
          object = {
            value: $(this).find(".value").val(),
            icon: $(this).find("img").attr('src'),
            role: $(this).find(".role").val(),
            position: $(this).find(".position").val(),
            titles: $(this).find(".titles").val()
          };
        }
        if ($(this).find(".title").text() != "" && $(this).find("img").attr('src') != "")
          temporaryList.push(object);
      });
      if (activeClient.id == 'user') {
        clientBlacklist = temporaryList;
        clientsList[0].blacklist = temporaryList;
      } else {
        defaultBlacklist = temporaryList;
        clientsList[1].blacklist = temporaryList;
      }
    },
    start: function(event, ui) {
      ui.item.startPos = ui.item.index();
      draggedCard = ui.item;
      cardOrigin = $('#' + draggedCard[0].id).closest('.containerList').attr('id');
    },
    stop: function(event, ui) {
      startPositionObject = draggedCard[0];
      let endPosition = ui.item.index();
      let stopPosition;
      if (activeClient.id == 'user') {
        if (renderedClientCards[endPosition - 1] == undefined) {
          stopPosition = renderedClientCards[endPosition].position;
        } else {
          stopPosition = renderedClientCards[endPosition - 1].position;
        }
      }
      if ($('#' + startPositionObject.id).closest('.containerList').attr('id') == 'garanteeContainer') {
        let filteredObj = actives.filter(el => el.value == startPositionObject.id);
        let removeRenderedPosition = renderedClientCards.findIndex(el => el.value == startPositionObject.id);
        let temporaryList = [];
        if (activeClient.id == "user") {
          if (stopPosition == 'first') {
            filteredObj[0].position = 'first';
            renderedClientCards.splice(ui.item.index(), 0, filteredObj[0]);
            for (let i = 0; i < renderedClientCards.length; i++) {
              if (renderedClientCards[i].role !== 'default') {
                temporaryList.push(renderedClientCards[i]);
              }
            }
            temporaryList = remove_duplicates(temporaryList);
            clientGarantee = temporaryList;
            activeClient.garantee = temporaryList;
          } else {
            filteredObj[0].position = 'end';
            renderedClientCards.splice(ui.item.index(), 0, filteredObj[0]);
            if (cardOrigin == 'blacklistContainer' && stopPosition == 'center') {
              renderedClientCards.splice(removeRenderedPosition, 1);
            } else {}
            for (let i = 0; i < renderedClientCards.length; i++) {
              if (renderedClientCards[i].role !== 'default') {
                temporaryList.push(renderedClientCards[i]);
              }
            }
            temporaryList = remove_duplicates(temporaryList);
            clientGarantee = temporaryList;
            activeClient.garantee = temporaryList;
          }
        }
      }
    }
  });
  $("#blacklist").children().disableSelection();
  $(".newCard")
    .click(function() {
      event.stopPropagation();
      $(this).addClass("active");
    });
  // Newcard Autocomplete input
  $("#newGarantee").autocomplete({
      minLength: 0,
      source: function(request, response) {
        var matcher = new RegExp("^" + $.ui.autocomplete.escapeRegex(request.term), "i");
        response($.grep(actives, function(value) {
          value = value.value || value;
          return matcher.test(value) || matcher.test(normalize(value));
        }));
      },
      select: function(event, ui) {
        $(".newCard #icon").val(ui.item.icon);
        $(".newCard #value").val(ui.item.titles);
        return false;
      },
      focus: function(event, ui) {
        $("#newGarantee").val(ui.item.titles);
        return false;
      },
      messages: {
        noResults: '',
        results: function() {}
      }
    })
    .autocomplete("instance")._renderItem = function(ul, item) {
      return $("<li>")
        .append("<div>" + item.titles + "</div>")
        .appendTo(ul);
    };
  // New Blacklist Autocomplete input
  $("#newBlacklistActive").autocomplete({
      minLength: 0,
      source: function(request, response) {
        var matcher = new RegExp("^" + $.ui.autocomplete.escapeRegex(request.term), "i");
        response($.grep(actives, function(value) {
          value = value.value || value;
          return matcher.test(value) || matcher.test(normalize(value));
        }));
      },
      select: function(event, ui) {
        $(".newCard #dontsellIcon").val(ui.item.icon);
        $(".newCard #dontsellValue").val(ui.item.titles);
        return false;
      },
      focus: function(event, ui) {
        $("#newBlacklistActive").val(ui.item.titles);
        return false;
      },
      messages: {
        noResults: '',
        results: function() {}
      }
    })
    .autocomplete("instance")._renderItem = function(ul, item) {
      return $("<li>")
        .append("<div>" + item.titles + "</div>")
        .appendTo(ul);
    };
  $("#newCardButton").click(function() {
    addNewCard();
  });
  $("#newCardBlacklistButton").click(function() {
    addNewCardBlacklist();
  });
  $('.ui-state-disabled').click(function() {});
  $('body').on('click', '.ui-state-disabled', function() {
    clickedButton = $(this);
  });
  $('body').on('click', '#confirmButton', function() {
    activeClient = getActiveUser();
    let cardContainer = clickedButton.closest('.containerList').attr('id');
    if (cardContainer == "garanteeContainer") {
      activeClient.default = [];
      clientDefault = [];
      for (let i = 0; i < renderedClientCards.length; i++) {
        renderedClientCards[i].role = "user";
        renderedClientCards[i].position = "first";
      }
      clientGarantee = renderedClientCards;
      activeClient.garantee = renderedClientCards;
      changeClient();
    } else {
      newBlacklistElementContainer = $("#blacklist").children().not('.hiddenCard').not('.newCard');
      let temporaryBlacklist = [];
      $.each(newBlacklistElementContainer, function(i, val) {
        let object = {
          value: val.id,
          icon: $(this).find("img").attr('src'),
          role: 'user',
          position: 'end',
          titles: $(val).find('.titles').val(),
        };
        temporaryBlacklist.push(object);
      });
      clientBlacklist = temporaryBlacklist;
      activeClient.blacklist = temporaryBlacklist;
      changeClient();
    }
  });
});

function renderDefault() {
  $("#garantee-list").children().not('.hiddenCard').not('.newCard').remove();
  $("#blacklist").children().not('.hiddenCard').not('.newCard').remove();
  renderDefaultGarantee("default", "garantee-list", defaultGarantee);
  renderDefaultGarantee("default", "blacklist", defaultBlacklist);
};

function renderClient() {
  renderClientGarantee("user", "garantee-list", clientGarantee, defaultGarantee);
  renderClientBlacklistGarantee("user", "blacklist", clientBlacklist, defaultBlacklist);
};
// Render all default cards when starting the page
function renderDefaultGarantee(id, listContainer, list) {
  var faIcon = "";
  $.each(list, function(i, val) {
    let card = "";
    if (val.role == "default") {
      faIcon = "fa-users";
      // draggableClass = "ui-state-disabled";
    } else {
      faIcon = "fa-user";
      // draggableClass = "drag";
    }
    if (val.icon !== "" && val.icon !== undefined) {
      card = renderCardWithIcon(val.value, val.icon, val.role, val.position, val.titles);
    } else {
      card = renderCardNoIcon(val.value, val.role, val.position, val.titles);
    };
    $(card).insertBefore("#" + listContainer + " .hiddenCard");
  });
};
// Render all default cards when starting the page
function renderClientGarantee(id, listContainer, garantees, defaults) {
  let renderCards = [];
  let renderDefault = defaults;
  var addedDefault = false;
  var faIcon = "";
  $.each(garantees, function(i, val) {
    if (val.position == "first") {
      // Adicionar os elementos que são First na lis  ta
      renderCards.push(val);
    } else {
      if (addedDefault == false) {
        let inGarantees = [];
        for (var i = 0; i < defaults.length; i++) {
          for (var j = 0; j < garantees.length; j++) {
            if (garantees[j].value == defaults[i].value) {
              inGarantees.push(i);
            }
          }
        }
        for (var i = 0; i < defaults.length; i++) {
          for (var j = 0; j < clientBlacklist.length; j++) {
            if (clientBlacklist[j].value == defaults[i].value) {
              inGarantees.push(i);
            }
          }
        }
        renderDefault = defaults.filter(function(el, i) {
          hasel = inGarantees.indexOf(i)
          return hasel == -1
        })
        $.each(renderDefault, function(i, val) {
          renderCards.push(val);
        });
        addedDefault = true;
        renderCards.push(val);
      } else {
        renderCards.push(val);
      }
    }
  });
  if (addedDefault == false) {
    let temporaryDefault = defaults;
    temporaryDefault = $.grep(temporaryDefault, function(val, i) {
      return !(garantees.findIndex(el => el.value == val.value) > -1) && !(clientBlacklist.findIndex(el => el.value == val.value) > -1);
    })
    renderCards = renderCards.concat(temporaryDefault);
  }
  if (listContainer == "blacklist") {
    renderedClientDefaultCards = renderCards;
  } else {
    renderedClientCards = renderCards;
  }
  $.each(renderCards, function(i, val) {
    let card = "";
    if (val.role == "default") {
      faIcon = "fa-users";
      // draggableClass = "ui-state-disabled";
    } else {
      faIcon = "fa-user";
      // draggableClass = "drag";
    }
    if (val.icon !== "" && val.icon !== undefined) {
      card = renderCardWithIcon(val.value, val.icon, val.role, val.position, val.titles);
    } else {
      card = renderCardNoIcon(val.value, val.role, val.position, val.titles);
    };
    $(card).insertBefore("#" + listContainer + " .hiddenCard");
  });
};
// Render all default cards when starting the page
function renderClientBlacklistGarantee(id, listContainer, garantees, defaults) {
  let renderCards = [];
  let renderDefault = defaults;
  var addedDefault = false;
  var faIcon = "";
  $.each(garantees, function(i, val) {
    if (val.position == "first") {
      // Adicionar os elementos que são First na lis  ta
      renderCards.push(val);
    } else {
      if (addedDefault == false) {
        let inGarantees = [];
        for (var i = 0; i < defaults.length; i++) {
          for (var j = 0; j < garantees.length; j++) {
            if (garantees[j].value == defaults[i].value) {
              inGarantees.push(i);
            }
          }
        }
        for (var i = 0; i < defaults.length; i++) {
          for (var j = 0; j < clientGarantee.length; j++) {
            if (clientGarantee[j].value == defaults[i].value) {
              inGarantees.push(i);
            }
          }
        }
        renderDefault = defaults.filter(function(el, i) {
          hasel = inGarantees.indexOf(i)
          return hasel == -1
        })
        $.each(renderDefault, function(i, val) {
          renderCards.push(val);
        });
        addedDefault = true;
        renderCards.push(val);
      } else {
        renderCards.push(val);
      }
    }
  });
  if (listContainer == "blacklist") {
    renderedClientDefaultCards = renderCards;
  } else {
    renderedClientCards = renderCards;
  }
  $.each(renderCards, function(i, val) {
    let card = "";
    if (val.role == "default") {
      faIcon = "fa-users";
      // draggableClass = "ui-state-disabled";
    } else {
      faIcon = "fa-user";
      // draggableClass = "drag";
    }
    if (val.icon !== "" && val.icon !== undefined) {
      card = renderCardWithIcon(val.value, val.icon, val.role, val.position, val.titles);
    } else {
      card = renderCardNoIcon(val.value, val.role, val.position, val.titles);
    };
    $(card).insertBefore("#" + listContainer + " .hiddenCard");
  });
};

function renderCardWithIcon(value, icon, role, position, titles) {
  let faIcon = "";
  let draggableClass = "";
  if (role == "default") {
    faIcon = "fa-users";
    if (getActiveUser().value == "Henrique") {
      notDraggableClass = "ui-state-disabled";
    } else {
      notDraggableClass = "drag";
    }
  } else {
    faIcon = "fa-user";
    notDraggableClass = "drag";
  }
  let card = '<div id="' + value + '" class="card ' + notDraggableClass + '">' +
    '<div class="card-top">' +
    '<div class="icon">' +
    '<i class="fas ' + faIcon + '"></i>' +
    '</div>' +
    '<div class="drag-symbol">' +
    '<i class="fas fa-ellipsis-v"></i>' +
    '<i class="fas fa-ellipsis-v"></i>' +
    '</div>' +
    '</div>' +
    '<div class="">' +
    '<img src="' + icon + '" class="image"/>' +
    '</div>' +
    '<span class="title">' + titles + '</span>' +
    '<input type="text" value="' + role + '" style="display: none;" class="role">' +
    '<input type="text" value="' + position + '" style="display: none;" class="position">' +
    '<input type="text" value="' + titles + '" style="display: none;" class="titles">' +
    '<input type="text" value="' + value + '" style="display: none;" class="value">' +
    '</div>';
  return (card);
};

function renderCardNoIcon(value, role, position, titles) {
  let faIcon = "";
  let draggableClass = "";
  if (role == "default") {
    faIcon = "fa-users";
    if (getActiveUser().value == "Henrique") {
      notDraggableClass = "ui-state-disabled";
    } else {
      notDraggableClass = "drag";
    }
  } else {
    faIcon = "fa-user";
    notDraggableClass = "drag";
  }
  let card = '<div id="' + value + '" class="card ' + notDraggableClass + '">' +
    '<div class="card-top">' +
    '<div class="icon">' +
    '<i class="fas ' + faIcon + '"></i>' +
    '</div>' +
    '<div class="drag-symbol">' +
    '<i class="fas fa-ellipsis-v"></i>' +
    '<i class="fas fa-ellipsis-v"></i>' +
    '</div>' +
    '</div>' +
    '<span class="title">' + titles + '</span>' +
    '<input type="text" value="' + role + '" style="display: none;" class="role">' +
    '<input type="text" value="' + position + '" style="display: none;" class="position">' +
    '<input type="text" value="' + titles + '" style="display: none;" class="titles">' +
    '<input type="text" value="' + value + '" style="display: none;" class="value">' +
    '<div class="">' +
    '</div>' +
    '</div>';
  return (card);
};

function addNewCard() {
  let card = '';
  let value = $(".newCard #value").val();
  activeClient = getActiveUser();
  let garantee = activeClient.garantee.filter(el => el.titles == value);
  let blacklist = activeClient.blacklist.filter(el => el.titles == value);
  let clientDefault = activeClient.default.filter(el => el.titles == value);
  let objectInActives = actives.filter(el => el.titles == value);
  let role = 'user';
  if (activeClient.id == 'default') {
    role = 'default';
    objectInActives[0].role = 'default';
  }
  if (garantee.length == 0 && blacklist.length == 0 && clientDefault.length == 0) {
    activeClient.garantee.push(objectInActives[0]);
    if (objectInActives[0].icon !== "" && objectInActives[0].icon !== undefined) {
      card = renderCardWithIcon(objectInActives[0].value, objectInActives[0].icon, role, objectInActives[0].position, objectInActives[0].titles);
    } else {
      card = renderCardNoIcon(objectInActives[0].value, role, objectInActives[0].position, objectInActives[0].titles);
    };
    $(card).insertBefore("#garantee-list .hiddenCard");
    if (activeClient.id == 'user') {
      renderedClientCards.push(objectInActives[0]);
    }
    // activeClient.garantee = defaultGarantee;
    $("#garantee-list").children().not('.hiddenCard').not('.newCard').remove();
    $("#blacklist").children().not('.hiddenCard').not('.newCard').remove();
    if ($("#clientId").val() == "Henrique") {
      renderClient();
    } else {
      renderDefault();
    }
  } else {
    $("#garantee-list .newCard").effect("shake");
  }
}

function addNewCardBlacklist() {
  let card = '';
  let value = $(".newCard #dontsellValue").val();
  activeClient = getActiveUser();
  let garantee = activeClient.garantee.filter(el => el.titles == value);
  let blacklist = activeClient.blacklist.filter(el => el.titles == value);
  let objectInActives = actives.filter(el => el.titles == value);
  let clientDefault = activeClient.default.filter(el => el.titles == value);
  let defaultBlack = defaultBlacklist.filter(el => el.titles == value);
  let role = 'user';
  if (activeClient.id == 'default') {
    role = 'default';
    objectInActives[0].role = 'default';
  }
  if (garantee.length == 0 && blacklist.length == 0 && clientDefault.length == 0 && defaultBlack.length == 0) {
    console.log('maoe');
    activeClient.blacklist.push(objectInActives[0]);
    if (objectInActives[0].icon !== "" && objectInActives[0].icon !== undefined) {
      card = renderCardWithIcon(objectInActives[0].value, objectInActives[0].icon, role, objectInActives[0].position, objectInActives[0].titles);
    } else {
      card = renderCardNoIcon(objectInActives[0].value, role, objectInActives[0].position, objectInActives[0].titles);
    };
    $(card).insertBefore("#blacklist .hiddenCard");
  } else {
    $("#blacklist .newCard").effect("shake");
  }
  activeClient.blacklist = defaultBlacklist;
}

function getActiveUser() {
  activeClientInput = $("#clientId").val();
  activeClient = clientsList.filter(el => el.value == activeClientInput)[0];
  return activeClient;
}

function changeClient() {
  renderedClientCards = [];
  $("#garantee-list").children().not('.hiddenCard').not('.newCard').remove();
  $("#blacklist").children().not('.hiddenCard').not('.newCard').remove();
  if ($("#clientId").val() == "Henrique") {
    renderClient();
  } else {
    renderDefault();
  }
  $(".content-container").removeClass("default");
  $(".content-container").removeClass("henrique");
  $(".content-container").addClass($("#clientId").val().toLowerCase());
}

function swapPosition(renderedClientCards, startPositionId, endPositionId, startPosition, endPosition) {
  let temporaryList = renderedClientCards;
  let removeIndex = 0;
  let returnedIndex = false;
  let firstIndex = 0;
  $.each(renderedClientCards, function(i, val) {
    if (val.role == 'default') {
      if (returnedIndex == false) {
        firstIndex = i;
        returnedIndex = true;
      }
      removeIndex++;
    }
  });
  temporaryList.splice(firstIndex, removeIndex);
  firstSwapObject = temporaryList.findIndex(el => el.value == startPositionId);
  secondSwapObject = temporaryList.findIndex(el => el.value == endPositionId);
  if (startPosition < endPosition) {
    temporaryList = [].concat(
      temporaryList.slice(0, firstSwapObject),
      temporaryList.slice(firstSwapObject + 1, secondSwapObject + 1), [temporaryList[firstSwapObject]],
      temporaryList.slice(secondSwapObject + 1)
    );
    clientGarantee = temporaryList;
    changeClient();
  } else {
    temporaryList = [].concat(
      temporaryList.slice(0, secondSwapObject), [temporaryList[firstSwapObject]],
      temporaryList.slice(secondSwapObject, firstSwapObject),
      temporaryList.slice(firstSwapObject + 1)
    );
    clientGarantee = temporaryList;
    changeClient();
  }
}

function array_move(arr, old_index, new_index) {
  if (new_index >= arr.length) {
    var k = new_index - arr.length + 1;
    while (k--) {
      arr.push(undefined);
    }
  }
  arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
  return arr; // for testing
};

function remove_duplicates(objectsArray) {
  var usedObjects = {};
  for (var i = objectsArray.length - 1; i >= 0; i--) {
    var so = JSON.stringify(objectsArray[i]);
    if (usedObjects[so]) {
      objectsArray.splice(i, 1);
    } else {
      usedObjects[so] = true;
    }
  }
  return objectsArray;
}

function remove_first_duplicate(objectsArray) {
  var usedObjects = {};
  for (var i = objectsArray.length - 1; i >= 0; i--) {
    var sorted_object = objectsArray.filter(el => el.value == objectsArray[i].value)
    if (sorted_object.length > 1) {
      objectsArray.splice(objectsArray.findIndex(el => el.value == sorted_object), 1);
    } else {
      usedObjects[sorted_object] = true;
    }
  }
  return objectsArray;
}

function remove_second_duplicate(objectsArray) {
  var usedObjects = {};
  for (var i = 0; i <= objectsArray.length - 1; i++) {
    var sorted_object = objectsArray.filter(el => el.value == objectsArray[i].value)
    if (sorted_object.length > 1) {
      objectsArray.splice(i, 1);
    } else {
      usedObjects[sorted_object] = true;
    }
  }
  return objectsArray;
}

function update_renderedClientCards() {
  let temporaryList = [];
  $.each($("#garantee-list").children().not('.hiddenCard').not('.newCard'), function(i, val) {
    let object = {
      value: val.id,
      icon: $(this).find("img").attr('src'),
      role: $(val).find('.role').val(),
      position: $(val).find('.position').val(),
      titles: $(val).find('.titles').val(),
    };
    temporaryList.push(object);
  });
  return temporaryList;
}
