/**
 * @module olcs.util
 */

class OLCesiumUtils {
 
	/**
	 * Cast to object.
	 * @param {Object} param
	 * @return {Object}
	 */
	obj(param) {
	  return param;
	}

	constructor(){

		/**
		 * @type {boolean|undefined}
		 * @private
		 */
		this.supportsImageRenderingPixelatedResult_ = undefined;


		/**
		 * @type {string|undefined}
		 * @private
		 */
		this.imageRenderingValueResult_ = undefined;

	}

	/**
	 * @return {boolean}
	 */
	supportsImageRenderingPixelated() {
	  if (this.supportsImageRenderingPixelatedResult_ === undefined) {
		const canvas = document.createElement('canvas');
		canvas.setAttribute('style', 'image-rendering: -moz-crisp-edges; image-rendering: pixelated;');
		// canvas.style.imageRendering will be undefined, null or an
		// empty string on unsupported browsers.
		const tmp = canvas.style['imageRendering']; // non standard
		this.supportsImageRenderingPixelatedResult_ = !!tmp;
		if (this.supportsImageRenderingPixelatedResult_) {
		  this.imageRenderingValueResult_ = tmp;
		}
	  }
	  return this.supportsImageRenderingPixelatedResult_;
	}


	/**
	 * @return {string}
	 */
	imageRenderingValue() {
	  this.supportsImageRenderingPixelated();
	  return this.imageRenderingValueResult_ || '';
	}

	/**
	 * Return the projection of the source that Cesium should use.
	 *
	 * @param {ol.source.Source} source Source.
	 * @returns {ol.proj.Projection} The projection of the source.
	 */
	getSourceProjection(source) {
	  return /** @type {ol.proj.Projection} */ (source.get('olcs.projection'))
		|| source.getProjection();
	}
} 

export const olcsUtil = new OLCesiumUtils()

/**
 * @param {ol.Observable} observable
 * @param {string} type
 * @param {Function} listener
 * @return {!ol.events.EventsKey}
 */
export function olcsListen(observable, type, listener) {
  // See https://github.com/openlayers/openlayers/pull/8481
  // ol.events.listen is internal so we use `on` instead.
  // And since `on` as a convoluted API (can return an EventsKey or an array of them)
  // we use a cast here.
  return /** @type {!ol.events.EventsKey} */ (observable.on(type, listener));
}

/**
 * Counter for getUid.
 * @type {number}
 */
let uidCounter_ = 0;

/**
 * Gets a unique ID for an object. This mutates the object so that further calls
 * with the same object as a parameter returns the same value. Unique IDs are generated
 * as a strictly increasing sequence. Adapted from goog.getUid.
 *
 * @param {Object} obj The object to get the unique ID for.
 * @return {number} The unique ID for the object.
 */
export function getUid(obj) {
  return obj.olcs_uid || (obj.olcs_uid = ++uidCounter_);
}

/**
 * Sort the passed array such that the relative order of equal elements is preverved.
 * See https://en.wikipedia.org/wiki/Sorting_algorithm#Stability for details.
 * @param {Array<*>} arr The array to sort (modifies original).
 * @param {!function(*, *): number} compareFnc Comparison function.
 */
export function stableSort(arr, compareFnc) {
  const length = arr.length;
  const tmp = Array(arr.length);
  for (let i = 0; i < length; i++) {
    tmp[i] = {index: i, value: arr[i]};
  }
  tmp.sort((a, b) => compareFnc(a.value, b.value) || a.index - b.index);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = tmp[i].value;
  }
}

/**
 * @param {Node} node The node to remove.
 * @returns {Node} The node that was removed or null.
 */
export function removeNode(node) {
  return node && node.parentNode ? node.parentNode.removeChild(node) : null;
}

/**
 * @param {Node} node The node to remove the children from.
 */
export function removeChildren(node) {
  while (node.lastChild) {
    node.removeChild(node.lastChild);
  }
}

/**
 * @param {Cesium.Scene} scene The scene.
 */
export function isGroundPolylinePrimitiveSupported(scene) {
  const obj = Cesium.GroundPolylinePrimitive;
  return obj && obj.isSupported(scene);
}