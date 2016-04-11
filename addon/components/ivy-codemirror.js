import CodeMirror from 'codemirror';
import Ember from 'ember';

export default Ember.Component.extend({
  /**
   * The value of the editor.
   *
   * @property value
   * @type {String}
   * @default null
   */
  value: null,

  autofocus: false,
  coverGutterNextToScrollbar: false,
  electricChars: true,
  extraKeys: null,
  firstLineNumber: 1,
  fixedGutter: true,
  historyEventDelay: 1250,
  indentUnit: 2,
  indentWithTabs: false,
  keyMap: 'default',
  lineNumbers: false,
  lineWrapping: false,
  mode: null,
  readOnly: false,
  rtlMoveVisually: true,
  showCursorWhenSelecting: false,
  smartIndent: true,
  tabSize: 4,
  tabindex: null,
  theme: 'default',
  undoDepth: 200,

  tagName: 'textarea',

  /**
   * Force CodeMirror to refresh.
   *
   * @method refresh
   */
  refresh() {
    this._codeMirror.refresh();
  },

  didInsertElement() {
    this._super(...arguments);

    this._codeMirror = CodeMirror.fromTextArea(this.get('element'));

    // Set up handlers for CodeMirror events.
    this._bindCodeMirrorEvent('change', this, '_updateValue');
    this._bindCodeMirrorEvent('keydown', this, '_preventBubbling');
    this._bindCodeMirrorEvent('keyup', this, '_preventBubbling');

    this._bindCodeMirrorProperty('value', this, '_valueDidChange');
    this._valueDidChange();

    // Force a refresh on `becameVisible`, since CodeMirror won't render itself
    // onto a hidden element.
    this.on('becameVisible', this, 'refresh');

    // Private action used by tests. Do not rely on this in your apps.
    this.sendAction('_onReady', this._codeMirror);
  },

  didRender() {
    this._super(...arguments);

    this.updateCodeMirrorOptions();
  },

  updateCodeMirrorOption(option, value) {
    if (this._codeMirror.getOption(option) !== value) {
      this._codeMirror.setOption(option, value);
    }
  },

  updateCodeMirrorOptions() {
    const options = this.get('options');

    if (options) {
      Object.keys(options).forEach(function(option) {
        this.updateCodeMirrorOption(option, options[option]);
      }, this);
    }
  },

  /**
   * Bind a handler for `event`, to be torn down in `willDestroyElement`.
   *
   * @private
   * @method _bindCodeMirrorEvent
   */
  _bindCodeMirrorEvent(event, target, method) {
    const callback = Ember.run.bind(target, method);

    this._codeMirror.on(event, callback);

    this.on('willDestroyElement', this, function() {
      this._codeMirror.off(event, callback);
    });
  },

  /**
   * Bind an observer on `key`, to be torn down in `willDestroyElement`.
   *
   * @private
   * @method _bindCodeMirrorProperty
   */
  _bindCodeMirrorProperty(key, target, method) {
    this.addObserver(key, target, method);

    this.on('willDestroyElement', this, function() {
      this.removeObserver(key, target, method);
    });
  },

  /**
   * Update the `value` property when a CodeMirror `change` event occurs.
   *
   * @private
   * @method _updateValue
   */
  _updateValue(instance, changeObj) {
    const value = instance.getValue();
    this.set('value', value);
    this.sendAction('valueUpdated', value, instance, changeObj);
  },

  _valueDidChange() {
    const value = this.get('value');

    if (value !== this._codeMirror.getValue()) {
      this._codeMirror.setValue(value || '');
    }
  },
  _preventBubbling: function(instance, event){
      event.stopPropagation();
  }
});
