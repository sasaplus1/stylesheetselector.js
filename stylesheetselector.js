/**
 * @license
 *
 * stylesheetselector.js
 * Copyright (c) 2011, sasa+1
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * - Redistributions of source code must retain the above copyright notice,
 *   this list of conditions and the following disclaimer.
 *
 * - Redistributions in binary form must reproduce the above copyright notice,
 *   this list of conditions and the following disclaimer in the documentation
 *   and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF
 * THE POSSIBILITY OF SUCH DAMAGE.
 */
(function(){

  var StyleSheet = (function(){

    var isWebKit_ = typeof navigator['taintEnabled'] === 'undefined';

    /**
     * get stylesheet list
     *
     * @return {Object}
     */
    function getStyleSheetList_() {
      var i,
          len,
          links,
          styleSheetList;
      if (typeof document.styleSheets !== 'undefined' && !isWebkit_) {
        return document.styleSheets;
      }
      if (typeof getStyleSheetList_.memoize !== 'undefined') {
        return getStyleSheetList_.memoize;
      }
      links = document.getElementsByTagName('link');
      styleSheetList = [];
      for (i = 0, len = links.length; i < len; i += 1) {
        if (typeof i.rel !== 'undefined' &&
            i.rel.toLowerCase().indexOf('stylesheet') !== -1 &&
            typeof i.title !== 'undefined') {
          styleSheetList.push(links[i]);
        }
      }
      getStyleSheetList_.memoize = styleSheetList;
      return styleSheetList;
    }

    /**
     * get current stylesheet title
     *
     * @return {String}
     */
    function getStyleSheet() {
      var i,
          len,
          styleSheetList = getStyleSheetList_();
      for (i = 0, len = styleSheetList.length; i < len; i += 1) {
        if (!styleSheetList[i].disabled) {
          return styleSheetList[i].title;
        }
      }
      return '';
    }

    /**
     * set stylesheet
     *
     * @param {String} title
     */
    function setStyleSheet(title) {
      var i,
          len,
          styleSheetList = getStyleSheetList_(),
          value = title.toString();
      for (i = 0, len = styleSheetList.length; i < len; i += 1) {
        styleSheetList[i].disabled = (styleSheetList[i].title !== value);
        if (isWebKit_) {
          styleSheetList[i].disabled = !styleSheetList[i].disabled;
          styleSheetList[i].disabled = !styleSheetList[i].disabled;
        }
      }
    }

    return {
      get: getStyleSheet,
      set: setStyleSheet
    };

  }()),

  Cookie = (function(){

    /**
     * clear cookie
     *
     * @param {Object} values
     */
    function clearCookie(values) {
      setCookie({
        key:    values.key.toString()    || '',
        value:  '',
        domain: values.domain.toString() || '',
        path:   values.path.toString()   || '',
        limit:  0,
        secure: values.secure            || false
      });
    }

    /**
     * get cookie value of key
     *
     * @param {String} key
     * @return {String}
     */
    function getCookie(key) {
      var i,
          len,
          cookie = document.cookie.split(';'),
          keyValue = key.toString();
      for (i = 0, len = cookie.length; i < len; i += 1) {
        if (cookie[i].indexOf(keyValue) !== -1) {
          return cookie[i].slice(keyValue.length + 1, cookie[i].length);
        }
      }
      return '';
    }

    /**
     * set cookie
     *
     * @param {Object} values
     */
    function setCookie(values) {
      var cookieString,
          limitDate,
          key    = values.key.toString()    || '',
          value  = values.value.toString()  || '',
          domain = values.domain.toString() || '',
          path   = values.path.toString()   || '',
          limit  = values.limit             || 0,
          secure = values.secure            || false;
      cookieString = key + '=' + value + ';domain=' + domain + ';path=' + path;
      if (typeof limit === 'Number') {
        limitDate = new Date();
        limitDate.setTime(
            (limit > 0) ? limitDate.getTime() + 24 * 60 * 60 * 1000 * limit : 0
        );
        cookieString += ';expires=' + limitDate.toGMTString();
      }
      if (secure) {
        cookieString += ';secure';
      }
      document.cookie = cookieString;
    }

    return {
      clear: clearCookie,
      get: getCookie,
      set: setCookie
    };

  }());

}());
