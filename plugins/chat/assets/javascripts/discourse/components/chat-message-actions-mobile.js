import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import discourseLater from "discourse-common/lib/later";
import { action } from "@ember/object";
import { isTesting } from "discourse-common/config/environment";
import { inject as service } from "@ember/service";

export default class ChatMessageActionsMobile extends Component {
  @service capabilities;

  @tracked hasExpandedReply = false;
  @tracked showFadeIn = false;

  messageActions = null;

  @action
  fadeAndVibrate() {
    discourseLater(this.#addFadeIn.bind(this));

    if (this.capabilities.canVibrate && !isTesting()) {
      navigator.vibrate(5);
    }
  }

  @action
  expandReply(event) {
    event.stopPropagation();
    this.hasExpandedReply = true;
  }

  @action
  collapseMenu(event) {
    event.stopPropagation();
    this.#onCloseMenu();
  }

  @action
  actAndCloseMenu(fn) {
    fn?.();
    this.#onCloseMenu();
  }

  #onCloseMenu() {
    this.#removeFadeIn();

    // we don't want to remove the component right away as it's animating
    // 200 is equal to the duration of the css animation
    discourseLater(() => {
      if (this.isDestroying || this.isDestroyed) {
        return;
      }

      // by ensuring we are not hovering any message anymore
      // we also ensure the menu is fully removed
      this.args.onHoverMessage?.(null);
    }, 200);
  }

  #addFadeIn() {
    this.showFadeIn = true;
  }

  #removeFadeIn() {
    this.showFadeIn = false;
  }
}
