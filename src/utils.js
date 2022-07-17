// ItemDrag.defaultStartPredicate from muuri/src/Item/Itemdrag.js
//    couldn't get access to default behavior when wanted to slightly override it so copied it here
export var defaultStartPredicate = function(item, event, options) {
  var drag = item._drag;
  var predicate = drag._startPredicateData || drag._setupStartPredicate(options);

  // Final event logic. At this stage return value does not matter anymore,
  // the predicate is either resolved or it's not and there's nothing to do
  // about it. Here we just reset data and if the item element is a link
  // we follow it (if there has only been slight movement).
  if (event.isFinal) {
    drag._finishStartPredicate(event);
    return;
  }

  // Find and store the handle element so we can check later on if the
  // cursor is within the handle. If we have a handle selector let's find
  // the corresponding element. Otherwise let's use the item element as the
  // handle.
  if (!predicate.handleElement) {
    predicate.handleElement = drag._getStartPredicateHandle(event);
    if (!predicate.handleElement) return false;
  }

  // If delay is defined let's keep track of the latest event and initiate
  // delay if it has not been done yet.
  if (predicate.delay) {
    predicate.event = event;
    if (!predicate.delayTimer) {
      predicate.delayTimer = window.setTimeout(function() {
        predicate.delay = 0;
        if (drag._resolveStartPredicate(predicate.event)) {
          drag._forceResolveStartPredicate(predicate.event);
          drag._resetStartPredicate();
        }
      }, predicate.delay);
    }
  }

  return drag._resolveStartPredicate(event);
};

