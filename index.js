var __create = Object.create;
var __defProp = Object.defineProperty;
var __getProtoOf = Object.getPrototypeOf;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __toESM = (mod, isNodeMode, target) => {
  target = mod != null ? __create(__getProtoOf(mod)) : {};
  const to = isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target;
  for (let key of __getOwnPropNames(mod))
    if (!__hasOwnProp.call(to, key))
      __defProp(to, key, {
        get: () => mod[key],
        enumerable: true
      });
  return to;
};
var __toCommonJS = (from) => {
  const moduleCache = __toCommonJS.moduleCache ??= new WeakMap;
  var cached = moduleCache.get(from);
  if (cached)
    return cached;
  var to = __defProp({}, "__esModule", { value: true });
  var desc = { enumerable: false };
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key))
        __defProp(to, key, {
          get: () => from[key],
          enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
        });
  }
  moduleCache.set(from, to);
  return to;
};
var __commonJS = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);
var __esm = (fn, res) => () => (fn && (res = fn(fn = 0)), res);

// node_modules/penpal/es5/enums.js
var require_enums = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.NativeEventType = exports.NativeErrorName = exports.ErrorCode = exports.Resolution = exports.MessageType = undefined;
  var MessageType;
  exports.MessageType = MessageType;
  (function(MessageType2) {
    MessageType2["Call"] = "call";
    MessageType2["Reply"] = "reply";
    MessageType2["Syn"] = "syn";
    MessageType2["SynAck"] = "synAck";
    MessageType2["Ack"] = "ack";
  })(MessageType || (exports.MessageType = MessageType = {}));
  var Resolution;
  exports.Resolution = Resolution;
  (function(Resolution2) {
    Resolution2["Fulfilled"] = "fulfilled";
    Resolution2["Rejected"] = "rejected";
  })(Resolution || (exports.Resolution = Resolution = {}));
  var ErrorCode;
  exports.ErrorCode = ErrorCode;
  (function(ErrorCode2) {
    ErrorCode2["ConnectionDestroyed"] = "ConnectionDestroyed";
    ErrorCode2["ConnectionTimeout"] = "ConnectionTimeout";
    ErrorCode2["NoIframeSrc"] = "NoIframeSrc";
  })(ErrorCode || (exports.ErrorCode = ErrorCode = {}));
  var NativeErrorName;
  exports.NativeErrorName = NativeErrorName;
  (function(NativeErrorName2) {
    NativeErrorName2["DataCloneError"] = "DataCloneError";
  })(NativeErrorName || (exports.NativeErrorName = NativeErrorName = {}));
  var NativeEventType;
  exports.NativeEventType = NativeEventType;
  (function(NativeEventType2) {
    NativeEventType2["Message"] = "message";
  })(NativeEventType || (exports.NativeEventType = NativeEventType = {}));
});

// node_modules/penpal/es5/createDestructor.js
var require_createDestructor = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = undefined;
  var _default = (localName, log) => {
    const callbacks = [];
    let destroyed = false;
    return {
      destroy(error) {
        if (!destroyed) {
          destroyed = true;
          log(`${localName}: Destroying connection`);
          callbacks.forEach((callback) => {
            callback(error);
          });
        }
      },
      onDestroy(callback) {
        destroyed ? callback() : callbacks.push(callback);
      }
    };
  };
  exports.default = _default;
});

// node_modules/penpal/es5/createLogger.js
var require_createLogger = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = undefined;
  var _default = (debug) => {
    return (...args) => {
      if (debug) {
        console.log("[Penpal]", ...args);
      }
    };
  };
  exports.default = _default;
});

// node_modules/penpal/es5/parent/getOriginFromSrc.js
var require_getOriginFromSrc = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = undefined;
  var DEFAULT_PORT_BY_PROTOCOL = {
    "http:": "80",
    "https:": "443"
  };
  var URL_REGEX = /^(https?:)?\/\/([^/:]+)?(:(\d+))?/;
  var opaqueOriginSchemes = ["file:", "data:"];
  var _default = (src) => {
    if (src && opaqueOriginSchemes.find((scheme) => src.startsWith(scheme))) {
      return "null";
    }
    const location = document.location;
    const regexResult = URL_REGEX.exec(src);
    let protocol;
    let hostname;
    let port;
    if (regexResult) {
      protocol = regexResult[1] ? regexResult[1] : location.protocol;
      hostname = regexResult[2];
      port = regexResult[4];
    } else {
      protocol = location.protocol;
      hostname = location.hostname;
      port = location.port;
    }
    const portSuffix = port && port !== DEFAULT_PORT_BY_PROTOCOL[protocol] ? `:${port}` : "";
    return `${protocol}//${hostname}${portSuffix}`;
  };
  exports.default = _default;
});

// node_modules/penpal/es5/errorSerialization.js
var require_errorSerialization = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.deserializeError = exports.serializeError = undefined;
  var serializeError = ({
    name,
    message,
    stack
  }) => ({
    name,
    message,
    stack
  });
  exports.serializeError = serializeError;
  var deserializeError = (obj) => {
    const deserializedError = new Error;
    Object.keys(obj).forEach((key) => deserializedError[key] = obj[key]);
    return deserializedError;
  };
  exports.deserializeError = deserializeError;
});

// node_modules/penpal/es5/connectCallReceiver.js
var require_connectCallReceiver = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = undefined;
  var _errorSerialization = require_errorSerialization();
  var _enums = require_enums();
  var _default = (info, serializedMethods, log) => {
    const {
      localName,
      local,
      remote,
      originForSending,
      originForReceiving
    } = info;
    let destroyed = false;
    const handleMessageEvent = (event) => {
      if (event.source !== remote || event.data.penpal !== _enums.MessageType.Call) {
        return;
      }
      if (originForReceiving !== "*" && event.origin !== originForReceiving) {
        log(`${localName} received message from origin ${event.origin} which did not match expected origin ${originForReceiving}`);
        return;
      }
      const callMessage = event.data;
      const {
        methodName,
        args,
        id
      } = callMessage;
      log(`${localName}: Received ${methodName}() call`);
      const createPromiseHandler = (resolution) => {
        return (returnValue) => {
          log(`${localName}: Sending ${methodName}() reply`);
          if (destroyed) {
            log(`${localName}: Unable to send ${methodName}() reply due to destroyed connection`);
            return;
          }
          const message = {
            penpal: _enums.MessageType.Reply,
            id,
            resolution,
            returnValue
          };
          if (resolution === _enums.Resolution.Rejected && returnValue instanceof Error) {
            message.returnValue = (0, _errorSerialization.serializeError)(returnValue);
            message.returnValueIsError = true;
          }
          try {
            remote.postMessage(message, originForSending);
          } catch (err) {
            if (err.name === _enums.NativeErrorName.DataCloneError) {
              const errorReplyMessage = {
                penpal: _enums.MessageType.Reply,
                id,
                resolution: _enums.Resolution.Rejected,
                returnValue: (0, _errorSerialization.serializeError)(err),
                returnValueIsError: true
              };
              remote.postMessage(errorReplyMessage, originForSending);
            }
            throw err;
          }
        };
      };
      new Promise((resolve) => resolve(serializedMethods[methodName].apply(serializedMethods, args))).then(createPromiseHandler(_enums.Resolution.Fulfilled), createPromiseHandler(_enums.Resolution.Rejected));
    };
    local.addEventListener(_enums.NativeEventType.Message, handleMessageEvent);
    return () => {
      destroyed = true;
      local.removeEventListener(_enums.NativeEventType.Message, handleMessageEvent);
    };
  };
  exports.default = _default;
});

// node_modules/penpal/es5/generateId.js
var require_generateId = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = undefined;
  var id = 0;
  var _default = () => ++id;
  exports.default = _default;
});

// node_modules/penpal/es5/methodSerialization.js
var require_methodSerialization = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.deserializeMethods = exports.serializeMethods = exports.setAtKeyPath = undefined;
  var KEY_PATH_DELIMITER = ".";
  var keyPathToSegments = (keyPath) => keyPath ? keyPath.split(KEY_PATH_DELIMITER) : [];
  var segmentsToKeyPath = (segments) => segments.join(KEY_PATH_DELIMITER);
  var createKeyPath = (key, prefix) => {
    const segments = keyPathToSegments(prefix || "");
    segments.push(key);
    return segmentsToKeyPath(segments);
  };
  var setAtKeyPath = (subject, keyPath, value) => {
    const segments = keyPathToSegments(keyPath);
    segments.reduce((prevSubject, key, idx) => {
      if (typeof prevSubject[key] === "undefined") {
        prevSubject[key] = {};
      }
      if (idx === segments.length - 1) {
        prevSubject[key] = value;
      }
      return prevSubject[key];
    }, subject);
    return subject;
  };
  exports.setAtKeyPath = setAtKeyPath;
  var serializeMethods = (methods, prefix) => {
    const flattenedMethods = {};
    Object.keys(methods).forEach((key) => {
      const value = methods[key];
      const keyPath = createKeyPath(key, prefix);
      if (typeof value === "object") {
        Object.assign(flattenedMethods, serializeMethods(value, keyPath));
      }
      if (typeof value === "function") {
        flattenedMethods[keyPath] = value;
      }
    });
    return flattenedMethods;
  };
  exports.serializeMethods = serializeMethods;
  var deserializeMethods = (flattenedMethods) => {
    const methods = {};
    for (const keyPath in flattenedMethods) {
      setAtKeyPath(methods, keyPath, flattenedMethods[keyPath]);
    }
    return methods;
  };
  exports.deserializeMethods = deserializeMethods;
});

// node_modules/penpal/es5/connectCallSender.js
var require_connectCallSender = __commonJS((exports) => {
  var _interopRequireDefault = function(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  };
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = undefined;
  var _generateId = _interopRequireDefault(require_generateId());
  var _errorSerialization = require_errorSerialization();
  var _methodSerialization = require_methodSerialization();
  var _enums = require_enums();
  var _default = (callSender, info, methodKeyPaths, destroyConnection, log) => {
    const {
      localName,
      local,
      remote,
      originForSending,
      originForReceiving
    } = info;
    let destroyed = false;
    log(`${localName}: Connecting call sender`);
    const createMethodProxy = (methodName) => {
      return (...args) => {
        log(`${localName}: Sending ${methodName}() call`);
        let iframeRemoved;
        try {
          if (remote.closed) {
            iframeRemoved = true;
          }
        } catch (e) {
          iframeRemoved = true;
        }
        if (iframeRemoved) {
          destroyConnection();
        }
        if (destroyed) {
          const error = new Error(`Unable to send ${methodName}() call due ` + `to destroyed connection`);
          error.code = _enums.ErrorCode.ConnectionDestroyed;
          throw error;
        }
        return new Promise((resolve, reject) => {
          const id = (0, _generateId.default)();
          const handleMessageEvent = (event) => {
            if (event.source !== remote || event.data.penpal !== _enums.MessageType.Reply || event.data.id !== id) {
              return;
            }
            if (originForReceiving !== "*" && event.origin !== originForReceiving) {
              log(`${localName} received message from origin ${event.origin} which did not match expected origin ${originForReceiving}`);
              return;
            }
            const replyMessage = event.data;
            log(`${localName}: Received ${methodName}() reply`);
            local.removeEventListener(_enums.NativeEventType.Message, handleMessageEvent);
            let returnValue = replyMessage.returnValue;
            if (replyMessage.returnValueIsError) {
              returnValue = (0, _errorSerialization.deserializeError)(returnValue);
            }
            (replyMessage.resolution === _enums.Resolution.Fulfilled ? resolve : reject)(returnValue);
          };
          local.addEventListener(_enums.NativeEventType.Message, handleMessageEvent);
          const callMessage = {
            penpal: _enums.MessageType.Call,
            id,
            methodName,
            args
          };
          remote.postMessage(callMessage, originForSending);
        });
      };
    };
    const flattenedMethods = methodKeyPaths.reduce((api, name) => {
      api[name] = createMethodProxy(name);
      return api;
    }, {});
    Object.assign(callSender, (0, _methodSerialization.deserializeMethods)(flattenedMethods));
    return () => {
      destroyed = true;
    };
  };
  exports.default = _default;
});

// node_modules/penpal/es5/parent/handleAckMessageFactory.js
var require_handleAckMessageFactory = __commonJS((exports) => {
  var _interopRequireDefault = function(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  };
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = undefined;
  var _connectCallReceiver = _interopRequireDefault(require_connectCallReceiver());
  var _connectCallSender = _interopRequireDefault(require_connectCallSender());
  var _default = (serializedMethods, childOrigin, originForSending, destructor, log) => {
    const {
      destroy,
      onDestroy
    } = destructor;
    let destroyCallReceiver;
    let receiverMethodNames;
    const callSender = {};
    return (event) => {
      if (childOrigin !== "*" && event.origin !== childOrigin) {
        log(`Parent: Handshake - Received ACK message from origin ${event.origin} which did not match expected origin ${childOrigin}`);
        return;
      }
      log("Parent: Handshake - Received ACK");
      const info = {
        localName: "Parent",
        local: window,
        remote: event.source,
        originForSending,
        originForReceiving: childOrigin
      };
      if (destroyCallReceiver) {
        destroyCallReceiver();
      }
      destroyCallReceiver = (0, _connectCallReceiver.default)(info, serializedMethods, log);
      onDestroy(destroyCallReceiver);
      if (receiverMethodNames) {
        receiverMethodNames.forEach((receiverMethodName) => {
          delete callSender[receiverMethodName];
        });
      }
      receiverMethodNames = event.data.methodNames;
      const destroyCallSender = (0, _connectCallSender.default)(callSender, info, receiverMethodNames, destroy, log);
      onDestroy(destroyCallSender);
      return callSender;
    };
  };
  exports.default = _default;
});

// node_modules/penpal/es5/parent/handleSynMessageFactory.js
var require_handleSynMessageFactory = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = undefined;
  var _enums = require_enums();
  var _default = (log, serializedMethods, childOrigin, originForSending) => {
    return (event) => {
      if (!event.source) {
        return;
      }
      if (childOrigin !== "*" && event.origin !== childOrigin) {
        log(`Parent: Handshake - Received SYN message from origin ${event.origin} which did not match expected origin ${childOrigin}`);
        return;
      }
      log("Parent: Handshake - Received SYN, responding with SYN-ACK");
      const synAckMessage = {
        penpal: _enums.MessageType.SynAck,
        methodNames: Object.keys(serializedMethods)
      };
      event.source.postMessage(synAckMessage, originForSending);
    };
  };
  exports.default = _default;
});

// node_modules/penpal/es5/parent/monitorIframeRemoval.js
var require_monitorIframeRemoval = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = undefined;
  var CHECK_IFRAME_IN_DOC_INTERVAL = 60000;
  var _default = (iframe, destructor) => {
    const {
      destroy,
      onDestroy
    } = destructor;
    const checkIframeInDocIntervalId = setInterval(() => {
      if (!iframe.isConnected) {
        clearInterval(checkIframeInDocIntervalId);
        destroy();
      }
    }, CHECK_IFRAME_IN_DOC_INTERVAL);
    onDestroy(() => {
      clearInterval(checkIframeInDocIntervalId);
    });
  };
  exports.default = _default;
});

// node_modules/penpal/es5/startConnectionTimeout.js
var require_startConnectionTimeout = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = undefined;
  var _enums = require_enums();
  var _default = (timeout, callback) => {
    let timeoutId;
    if (timeout !== undefined) {
      timeoutId = window.setTimeout(() => {
        const error = new Error(`Connection timed out after ${timeout}ms`);
        error.code = _enums.ErrorCode.ConnectionTimeout;
        callback(error);
      }, timeout);
    }
    return () => {
      clearTimeout(timeoutId);
    };
  };
  exports.default = _default;
});

// node_modules/penpal/es5/parent/validateIframeHasSrcOrSrcDoc.js
var require_validateIframeHasSrcOrSrcDoc = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = undefined;
  var _enums = require_enums();
  var _default = (iframe) => {
    if (!iframe.src && !iframe.srcdoc) {
      const error = new Error("Iframe must have src or srcdoc property defined.");
      error.code = _enums.ErrorCode.NoIframeSrc;
      throw error;
    }
  };
  exports.default = _default;
});

// node_modules/penpal/es5/parent/connectToChild.js
var require_connectToChild = __commonJS((exports) => {
  var _interopRequireDefault = function(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  };
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = undefined;
  var _enums = require_enums();
  var _createDestructor = _interopRequireDefault(require_createDestructor());
  var _createLogger = _interopRequireDefault(require_createLogger());
  var _getOriginFromSrc = _interopRequireDefault(require_getOriginFromSrc());
  var _handleAckMessageFactory = _interopRequireDefault(require_handleAckMessageFactory());
  var _handleSynMessageFactory = _interopRequireDefault(require_handleSynMessageFactory());
  var _methodSerialization = require_methodSerialization();
  var _monitorIframeRemoval = _interopRequireDefault(require_monitorIframeRemoval());
  var _startConnectionTimeout = _interopRequireDefault(require_startConnectionTimeout());
  var _validateIframeHasSrcOrSrcDoc = _interopRequireDefault(require_validateIframeHasSrcOrSrcDoc());
  var _default = (options) => {
    let {
      iframe,
      methods = {},
      childOrigin,
      timeout,
      debug = false
    } = options;
    const log = (0, _createLogger.default)(debug);
    const destructor = (0, _createDestructor.default)("Parent", log);
    const {
      onDestroy,
      destroy
    } = destructor;
    if (!childOrigin) {
      (0, _validateIframeHasSrcOrSrcDoc.default)(iframe);
      childOrigin = (0, _getOriginFromSrc.default)(iframe.src);
    }
    const originForSending = childOrigin === "null" ? "*" : childOrigin;
    const serializedMethods = (0, _methodSerialization.serializeMethods)(methods);
    const handleSynMessage = (0, _handleSynMessageFactory.default)(log, serializedMethods, childOrigin, originForSending);
    const handleAckMessage = (0, _handleAckMessageFactory.default)(serializedMethods, childOrigin, originForSending, destructor, log);
    const promise = new Promise((resolve, reject) => {
      const stopConnectionTimeout = (0, _startConnectionTimeout.default)(timeout, destroy);
      const handleMessage = (event) => {
        if (event.source !== iframe.contentWindow || !event.data) {
          return;
        }
        if (event.data.penpal === _enums.MessageType.Syn) {
          handleSynMessage(event);
          return;
        }
        if (event.data.penpal === _enums.MessageType.Ack) {
          const callSender = handleAckMessage(event);
          if (callSender) {
            stopConnectionTimeout();
            resolve(callSender);
          }
          return;
        }
      };
      window.addEventListener(_enums.NativeEventType.Message, handleMessage);
      log("Parent: Awaiting handshake");
      (0, _monitorIframeRemoval.default)(iframe, destructor);
      onDestroy((error) => {
        window.removeEventListener(_enums.NativeEventType.Message, handleMessage);
        if (error) {
          reject(error);
        }
      });
    });
    return {
      promise,
      destroy() {
        destroy();
      }
    };
  };
  exports.default = _default;
});

// node_modules/penpal/es5/child/handleSynAckMessageFactory.js
var require_handleSynAckMessageFactory = __commonJS((exports) => {
  var _interopRequireDefault = function(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  };
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = undefined;
  var _enums = require_enums();
  var _connectCallReceiver = _interopRequireDefault(require_connectCallReceiver());
  var _connectCallSender = _interopRequireDefault(require_connectCallSender());
  var _default = (parentOrigin, serializedMethods, destructor, log) => {
    const {
      destroy,
      onDestroy
    } = destructor;
    return (event) => {
      let originQualifies = parentOrigin instanceof RegExp ? parentOrigin.test(event.origin) : parentOrigin === "*" || parentOrigin === event.origin;
      if (!originQualifies) {
        log(`Child: Handshake - Received SYN-ACK from origin ${event.origin} which did not match expected origin ${parentOrigin}`);
        return;
      }
      log("Child: Handshake - Received SYN-ACK, responding with ACK");
      const originForSending = event.origin === "null" ? "*" : event.origin;
      const ackMessage = {
        penpal: _enums.MessageType.Ack,
        methodNames: Object.keys(serializedMethods)
      };
      window.parent.postMessage(ackMessage, originForSending);
      const info = {
        localName: "Child",
        local: window,
        remote: window.parent,
        originForSending,
        originForReceiving: event.origin
      };
      const destroyCallReceiver = (0, _connectCallReceiver.default)(info, serializedMethods, log);
      onDestroy(destroyCallReceiver);
      const callSender = {};
      const destroyCallSender = (0, _connectCallSender.default)(callSender, info, event.data.methodNames, destroy, log);
      onDestroy(destroyCallSender);
      return callSender;
    };
  };
  exports.default = _default;
});

// node_modules/penpal/es5/child/connectToParent.js
var require_connectToParent = __commonJS((exports) => {
  var _interopRequireDefault = function(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  };
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = undefined;
  var _createDestructor = _interopRequireDefault(require_createDestructor());
  var _createLogger = _interopRequireDefault(require_createLogger());
  var _enums = require_enums();
  var _handleSynAckMessageFactory = _interopRequireDefault(require_handleSynAckMessageFactory());
  var _methodSerialization = require_methodSerialization();
  var _startConnectionTimeout = _interopRequireDefault(require_startConnectionTimeout());
  var areGlobalsAccessible = () => {
    try {
      clearTimeout();
    } catch (e) {
      return false;
    }
    return true;
  };
  var _default = (options = {}) => {
    const {
      parentOrigin = "*",
      methods = {},
      timeout,
      debug = false
    } = options;
    const log = (0, _createLogger.default)(debug);
    const destructor = (0, _createDestructor.default)("Child", log);
    const {
      destroy,
      onDestroy
    } = destructor;
    const serializedMethods = (0, _methodSerialization.serializeMethods)(methods);
    const handleSynAckMessage = (0, _handleSynAckMessageFactory.default)(parentOrigin, serializedMethods, destructor, log);
    const sendSynMessage = () => {
      log("Child: Handshake - Sending SYN");
      const synMessage = {
        penpal: _enums.MessageType.Syn
      };
      const parentOriginForSyn = parentOrigin instanceof RegExp ? "*" : parentOrigin;
      window.parent.postMessage(synMessage, parentOriginForSyn);
    };
    const promise = new Promise((resolve, reject) => {
      const stopConnectionTimeout = (0, _startConnectionTimeout.default)(timeout, destroy);
      const handleMessage = (event) => {
        if (!areGlobalsAccessible()) {
          return;
        }
        if (event.source !== parent || !event.data) {
          return;
        }
        if (event.data.penpal === _enums.MessageType.SynAck) {
          const callSender = handleSynAckMessage(event);
          if (callSender) {
            window.removeEventListener(_enums.NativeEventType.Message, handleMessage);
            stopConnectionTimeout();
            resolve(callSender);
          }
        }
      };
      window.addEventListener(_enums.NativeEventType.Message, handleMessage);
      sendSynMessage();
      onDestroy((error) => {
        window.removeEventListener(_enums.NativeEventType.Message, handleMessage);
        if (error) {
          reject(error);
        }
      });
    });
    return {
      promise,
      destroy() {
        destroy();
      }
    };
  };
  exports.default = _default;
});

// node_modules/penpal/es5/types.js
var exports_types = {};
var init_types = __esm(() => {
});

// node_modules/penpal/es5/index.js
var require_es5 = __commonJS((exports) => {
  var _interopRequireDefault = function(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  };
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, "connectToChild", {
    enumerable: true,
    get: function() {
      return _connectToChild.default;
    }
  });
  Object.defineProperty(exports, "connectToParent", {
    enumerable: true,
    get: function() {
      return _connectToParent.default;
    }
  });
  Object.defineProperty(exports, "ErrorCode", {
    enumerable: true,
    get: function() {
      return _enums.ErrorCode;
    }
  });
  Object.defineProperty(exports, "Connection", {
    enumerable: true,
    get: function() {
      return _types.Connection;
    }
  });
  Object.defineProperty(exports, "AsyncMethodReturns", {
    enumerable: true,
    get: function() {
      return _types.AsyncMethodReturns;
    }
  });
  Object.defineProperty(exports, "CallSender", {
    enumerable: true,
    get: function() {
      return _types.CallSender;
    }
  });
  Object.defineProperty(exports, "Methods", {
    enumerable: true,
    get: function() {
      return _types.Methods;
    }
  });
  Object.defineProperty(exports, "PenpalError", {
    enumerable: true,
    get: function() {
      return _types.PenpalError;
    }
  });
  var _connectToChild = _interopRequireDefault(require_connectToChild());
  var _connectToParent = _interopRequireDefault(require_connectToParent());
  var _enums = require_enums();
  var _types = (init_types(), __toCommonJS(exports_types));
});

// node_modules/@chili-publish/publisher-interface/lib/PublisherInterface.js
var require_PublisherInterface = __commonJS((exports, module) => {
  var $parcel$export = function(e, n, v, s) {
    Object.defineProperty(e, n, { get: v, set: s, enumerable: true, configurable: true });
  };
  var $7i1sb$penpal = require_es5();
  $parcel$export(exports, "PublisherInterface", () => $3db7bcc71a7ab568$export$a13915682e709c4f, (v) => $3db7bcc71a7ab568$export$a13915682e709c4f = v);
  var $3db7bcc71a7ab568$var$__awaiter = function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve) {
        resolve(value);
      });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  var $3db7bcc71a7ab568$var$__classPrivateFieldGet = function(receiver, state, kind, f) {
    if (kind === "a" && !f)
      throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
      throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
  };
  var $3db7bcc71a7ab568$var$__classPrivateFieldSet = function(receiver, state, value, kind, f) {
    if (kind === "m")
      throw new TypeError("Private method is not writable");
    if (kind === "a" && !f)
      throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
      throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
  };
  var $3db7bcc71a7ab568$var$_PublisherInterface_editorObject;
  var $3db7bcc71a7ab568$var$createCustomFunctionsInterface = function(chiliWrapper, createDebugLog) {
    return {
      register: function(name, body) {
        return $3db7bcc71a7ab568$var$__awaiter(this, undefined, undefined, function* () {
          createDebugLog({
            functionName: "registerFunction()"
          });
          const response = yield chiliWrapper.registerFunction(name, body);
          if (response.isError)
            throw new Error(response.error);
        });
      },
      registerOnEvent: function(eventName, body) {
        return $3db7bcc71a7ab568$var$__awaiter(this, undefined, undefined, function* () {
          createDebugLog({
            functionName: "registerFunction()"
          });
          const response = yield chiliWrapper.registerFunctionOnEvent(eventName, body);
          if (response.isError)
            throw new Error(response.error);
        });
      },
      execute: function(name, ...args) {
        return $3db7bcc71a7ab568$var$__awaiter(this, undefined, undefined, function* () {
          createDebugLog({
            functionName: "executeRegisteredFunction()"
          });
          const response = yield chiliWrapper.executeRegisteredFunction(name, args);
          if (response.isError)
            throw new Error(response.error);
          return response.ok;
        });
      }
    };
  };

  class $3db7bcc71a7ab568$export$a13915682e709c4f {
    constructor() {
      this.customFunction = {
        register: function(name, body) {
          throw new Error("Function not implemented.");
        },
        registerOnEvent: function(eventName, body) {
          throw new Error("Function not implemented.");
        },
        execute: function(name, args) {
          throw new Error("Function not implemented.");
        }
      };
      this.chiliEventListenerCallbacks = new Map;
      this.debug = false;
      this.creationTime = "";
      $3db7bcc71a7ab568$var$_PublisherInterface_editorObject.set(this, null);
      this.getProperty = this.getObject;
    }
    static buildWithIframe(targetIframe, options) {
      return $3db7bcc71a7ab568$var$__awaiter(this, undefined, undefined, function* () {
        return $3db7bcc71a7ab568$export$a13915682e709c4f.build(Object.assign({
          targetIframe
        }, options));
      });
    }
    static buildOnElement(parentElement, editorURL, options) {
      return $3db7bcc71a7ab568$var$__awaiter(this, undefined, undefined, function* () {
        return $3db7bcc71a7ab568$export$a13915682e709c4f.build(Object.assign({
          parentElement,
          editorURL
        }, options));
      });
    }
    static build(options) {
      var _a, _b, _c, _d;
      return $3db7bcc71a7ab568$var$__awaiter(this, arguments, undefined, function* () {
        if (arguments[0].tagName == "IFRAME") {
          const originalOptions = (_a = arguments[1]) !== null && _a !== undefined ? _a : {};
          options = Object.assign(Object.assign({}, originalOptions), {
            targetIframe: arguments[0],
            debug: (_b = options.debug) !== null && _b !== undefined ? _b : originalOptions["penpalDebug"]
          });
        }
        const stringifiedOptions = ((opts) => {
          try {
            return JSON.stringify(opts);
          } catch (e) {
            return e.toString();
          }
        })(options);
        const publisherInterface = new $3db7bcc71a7ab568$export$a13915682e709c4f;
        publisherInterface.creationTime = new Date().toLocaleString();
        publisherInterface.debug = (_c = options.debug) !== null && _c !== undefined ? _c : false;
        publisherInterface.createDebugLog({
          functionName: "build()",
          customMessage: "Calling build() with options: " + stringifiedOptions
        });
        const iframe = (_d = options.targetIframe) !== null && _d !== undefined ? _d : document.createElement("iframe");
        publisherInterface.iframe = iframe;
        if (options.editorURL != null)
          iframe.src = options.editorURL;
        const connectionPromise = (0, $7i1sb$penpal.connectToChild)({
          iframe,
          methods: {
            handleEvents: publisherInterface.handleEvents.bind(publisherInterface)
          },
          timeout: options.timeout,
          debug: options.debug
        });
        if (options.parentElement != null)
          options.parentElement.appendChild(iframe);
        publisherInterface.child = yield connectionPromise.promise;
        publisherInterface.customFunction = $3db7bcc71a7ab568$var$createCustomFunctionsInterface(publisherInterface.child, publisherInterface.createDebugLog.bind(publisherInterface));
        const events = options.events;
        if (events != null && events.length > 0) {
          for (const event of events)
            if (typeof event == "string")
              publisherInterface.addListener(event);
            else
              publisherInterface.addListener(event.name, event.func);
        }
        return publisherInterface;
      });
    }
    handleEvents(eventName, id) {
      var _a;
      this.chiliEventListenerCallbacks.has(eventName) && ((_a = this.chiliEventListenerCallbacks.get(eventName)) === null || _a === undefined || _a(id));
      return eventName;
    }
    createDebugLog({ functionName, customMessage }) {
      if (this.debug) {
        if (customMessage != null)
          console.log(`[PublisherInterface - ${this.creationTime}]`, `${functionName} : ${customMessage}`);
        else
          console.log(`[PublisherInterface - ${this.creationTime}]`, `Creating ${functionName} call request`);
      }
    }
    get editorObject() {
      if ($3db7bcc71a7ab568$var$__classPrivateFieldGet(this, $3db7bcc71a7ab568$var$_PublisherInterface_editorObject, "f") == null)
        $3db7bcc71a7ab568$var$__classPrivateFieldSet(this, $3db7bcc71a7ab568$var$_PublisherInterface_editorObject, {
          Alert: this.alert.bind(this),
          GetDirtyState: this.getDirtyState.bind(this),
          NextPage: this.nextPage.bind(this),
          PreviousPage: this.previousPage.bind(this),
          SetSelectedPage: this.setSelectedPage.bind(this),
          GetSelectedPage: this.getSelectedPage.bind(this),
          GetSelectedPageName: this.getSelectedPageName.bind(this),
          GetNumPages: this.getNumPages.bind(this),
          RemoveListener: this.removeListener.bind(this),
          AddListener: this.addListener.bind(this),
          GetObject: this.getObject.bind(this),
          SetProperty: this.setProperty.bind(this),
          ExecuteFunction: this.executeFunction.bind(this),
          GetPageSnapshot: this.getPageSnapshot.bind(this),
          GetFrameSnapshot: this.getFrameSnapshot.bind(this),
          GetFrameSubjectArea: this.getFrameSubjectArea.bind(this),
          SetFrameSubjectArea: this.setFrameSubjectArea.bind(this),
          ClearFrameSubjectArea: this.clearFrameSubjectArea.bind(this),
          GetAssetSubjectInfo: this.getAssetSubjectInfo.bind(this),
          SetAssetSubjectInfo: this.setAssetSubjectInfo.bind(this),
          ClearAssetSubjectInfo: this.clearAssetSubjectInfo.bind(this),
          SetVariableIsLocked: this.setVariableIsLocked.bind(this)
        }, "f");
      return $3db7bcc71a7ab568$var$__classPrivateFieldGet(this, $3db7bcc71a7ab568$var$_PublisherInterface_editorObject, "f");
    }
    alert(message, title) {
      return $3db7bcc71a7ab568$var$__awaiter(this, undefined, undefined, function* () {
        this.createDebugLog({
          functionName: "alert()"
        });
        const response = yield this.child.alert(message, title);
        if (response.isError)
          throw new Error(response.error);
      });
    }
    getDirtyState() {
      return $3db7bcc71a7ab568$var$__awaiter(this, undefined, undefined, function* () {
        this.createDebugLog({
          functionName: "getDirtyState()"
        });
        const response = yield this.child.getDirtyState();
        if (response.isError)
          throw new Error(response.error);
        return response.ok;
      });
    }
    nextPage() {
      return $3db7bcc71a7ab568$var$__awaiter(this, undefined, undefined, function* () {
        this.createDebugLog({
          functionName: "nextPage()"
        });
        const response = yield this.child.nextPage();
        if (response.isError)
          throw new Error(response.error);
      });
    }
    previousPage() {
      return $3db7bcc71a7ab568$var$__awaiter(this, undefined, undefined, function* () {
        this.createDebugLog({
          functionName: "previousPage()"
        });
        const response = yield this.child.previousPage();
        if (response.isError)
          throw new Error(response.error);
      });
    }
    setSelectedPage(page) {
      return $3db7bcc71a7ab568$var$__awaiter(this, undefined, undefined, function* () {
        this.createDebugLog({
          functionName: "setSelectedPage()"
        });
        const response = yield this.child.setSelectedPage(page);
        if (response.isError)
          throw new Error(response.error);
      });
    }
    getSelectedPage() {
      return $3db7bcc71a7ab568$var$__awaiter(this, undefined, undefined, function* () {
        this.createDebugLog({
          functionName: "getSelectedPage()"
        });
        const response = yield this.child.getSelectedPage();
        if (response.isError)
          throw new Error(response.error);
        return response.ok;
      });
    }
    getSelectedPageName() {
      return $3db7bcc71a7ab568$var$__awaiter(this, undefined, undefined, function* () {
        this.createDebugLog({
          functionName: "getSelectedPageName()"
        });
        const response = yield this.child.getSelectedPageName();
        if (response.isError)
          throw new Error(response.error);
        return response.ok;
      });
    }
    getNumPages() {
      return $3db7bcc71a7ab568$var$__awaiter(this, undefined, undefined, function* () {
        this.createDebugLog({
          functionName: "getNumPages()"
        });
        const response = yield this.child.getNumPages();
        if (response.isError)
          throw new Error(response.error);
        return response.ok;
      });
    }
    removeListener(eventName) {
      return $3db7bcc71a7ab568$var$__awaiter(this, undefined, undefined, function* () {
        this.createDebugLog({
          functionName: "removeListener()"
        });
        this.chiliEventListenerCallbacks.delete(eventName);
        const response = yield this.child.removeListener(eventName);
        if (response.isError)
          throw new Error(response.error);
      });
    }
    addListener(eventName, callbackFunction) {
      return $3db7bcc71a7ab568$var$__awaiter(this, undefined, undefined, function* () {
        this.createDebugLog({
          functionName: "addListener()"
        });
        this.chiliEventListenerCallbacks.set(eventName, callbackFunction == null ? (targetID) => {
          if (window.OnEditorEvent != null)
            window.OnEditorEvent(eventName, targetID);
        } : callbackFunction);
        const response = yield this.child.addListener(eventName);
        if (response.isError)
          throw new Error(response.error);
      });
    }
    getObject(chiliPath) {
      return $3db7bcc71a7ab568$var$__awaiter(this, undefined, undefined, function* () {
        this.createDebugLog({
          functionName: "getObject()"
        });
        const response = yield this.child.getObject(chiliPath);
        if (response.isError)
          throw new Error(response.error);
        return response.ok;
      });
    }
    setProperty(chiliPath, property, value) {
      return $3db7bcc71a7ab568$var$__awaiter(this, undefined, undefined, function* () {
        this.createDebugLog({
          functionName: "setProperty()"
        });
        const response = yield this.child.setProperty(chiliPath, property, value);
        if (response.isError)
          throw new Error(response.error);
      });
    }
    executeFunction(chiliPath, functionName, ...args) {
      return $3db7bcc71a7ab568$var$__awaiter(this, undefined, undefined, function* () {
        this.createDebugLog({
          functionName: "executeFunction()"
        });
        const response = yield this.child.executeFunction(chiliPath, functionName, args);
        if (response.isError)
          throw new Error(response.error);
        return response.ok;
      });
    }
    getPageSnapshot(pageIndex, size, layers, frames, viewMode, transparentBackground) {
      return $3db7bcc71a7ab568$var$__awaiter(this, undefined, undefined, function* () {
        this.createDebugLog({
          functionName: "getPageSnapshot()"
        });
        const response = yield this.child.getPageSnapshot(pageIndex, size, layers, frames, viewMode, transparentBackground);
        if (response.isError)
          throw new Error(response.error);
        return response.ok;
      });
    }
    getFrameSnapshot(idOrTag, size, transparentBackground) {
      return $3db7bcc71a7ab568$var$__awaiter(this, undefined, undefined, function* () {
        this.createDebugLog({
          functionName: "getFrameSnapshot()"
        });
        const response = yield this.child.getFrameSnapshot(idOrTag, size, transparentBackground);
        if (response.isError)
          throw new Error(response.error);
        return response.ok;
      });
    }
    getFrameSubjectArea(idOrTag) {
      return $3db7bcc71a7ab568$var$__awaiter(this, undefined, undefined, function* () {
        this.createDebugLog({
          functionName: "getFrameSubjectArea()"
        });
        const response = yield this.child.getFrameSubjectArea(idOrTag);
        if (response.isError)
          throw new Error(response.error);
        return response.ok;
      });
    }
    setFrameSubjectArea(idOrTag, x, y, width, height) {
      return $3db7bcc71a7ab568$var$__awaiter(this, undefined, undefined, function* () {
        this.createDebugLog({
          functionName: "setFrameSubjectArea()"
        });
        const response = yield this.child.setFrameSubjectArea(idOrTag, x, y, width, height);
        if (response.isError)
          throw new Error(response.error);
      });
    }
    clearFrameSubjectArea(idOrTag) {
      return $3db7bcc71a7ab568$var$__awaiter(this, undefined, undefined, function* () {
        this.createDebugLog({
          functionName: "clearFrameSubjectArea()"
        });
        const response = yield this.child.clearFrameSubjectArea(idOrTag);
        if (response.isError)
          throw new Error(response.error);
      });
    }
    getAssetSubjectInfo(frameIdOrTag) {
      return $3db7bcc71a7ab568$var$__awaiter(this, undefined, undefined, function* () {
        this.createDebugLog({
          functionName: "getAssetSubjectInfo()"
        });
        const response = yield this.child.getAssetSubjectInfo(frameIdOrTag);
        if (response.isError)
          throw new Error(response.error);
        return response.ok;
      });
    }
    setAssetSubjectInfo(frameIdOrTag, x, y, width, height, poiX, poiY) {
      return $3db7bcc71a7ab568$var$__awaiter(this, undefined, undefined, function* () {
        this.createDebugLog({
          functionName: "setAssetSubjectInfo()"
        });
        const response = yield this.child.setAssetSubjectInfo(frameIdOrTag, x, y, width, height, poiX, poiY);
        if (response.isError)
          throw new Error(response.error);
      });
    }
    clearAssetSubjectInfo(frameIdOrTag) {
      return $3db7bcc71a7ab568$var$__awaiter(this, undefined, undefined, function* () {
        this.createDebugLog({
          functionName: "clearAssetSubjectInfo()"
        });
        const response = yield this.child.clearAssetSubjectInfo(frameIdOrTag);
        if (response.isError)
          throw new Error(response.error);
      });
    }
    setVariableIsLocked(variableName, isLocked) {
      return $3db7bcc71a7ab568$var$__awaiter(this, undefined, undefined, function* () {
        this.createDebugLog({
          functionName: "setVariableIsLocked()"
        });
        const response = yield this.child.setVariableIsLocked(variableName, isLocked);
        if (response.isError)
          throw new Error(response.error);
      });
    }
  }
  $3db7bcc71a7ab568$var$_PublisherInterface_editorObject = new WeakMap;
});

// node_modules/cross-fetch/dist/browser-ponyfill.js
var require_browser_ponyfill = __commonJS((exports, module) => {
  var global = typeof self !== "undefined" ? self : exports;
  var __self__ = function() {
    function F() {
      this.fetch = false;
      this.DOMException = global.DOMException;
    }
    F.prototype = global;
    return new F;
  }();
  (function(self2) {
    var irrelevant = function(exports2) {
      var support = {
        searchParams: "URLSearchParams" in self2,
        iterable: "Symbol" in self2 && "iterator" in Symbol,
        blob: "FileReader" in self2 && "Blob" in self2 && function() {
          try {
            new Blob;
            return true;
          } catch (e) {
            return false;
          }
        }(),
        formData: "FormData" in self2,
        arrayBuffer: "ArrayBuffer" in self2
      };
      function isDataView(obj) {
        return obj && DataView.prototype.isPrototypeOf(obj);
      }
      if (support.arrayBuffer) {
        var viewClasses = [
          "[object Int8Array]",
          "[object Uint8Array]",
          "[object Uint8ClampedArray]",
          "[object Int16Array]",
          "[object Uint16Array]",
          "[object Int32Array]",
          "[object Uint32Array]",
          "[object Float32Array]",
          "[object Float64Array]"
        ];
        var isArrayBufferView = ArrayBuffer.isView || function(obj) {
          return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1;
        };
      }
      function normalizeName(name) {
        if (typeof name !== "string") {
          name = String(name);
        }
        if (/[^a-z0-9\-#$%&'*+.^_`|~]/i.test(name)) {
          throw new TypeError("Invalid character in header field name");
        }
        return name.toLowerCase();
      }
      function normalizeValue(value) {
        if (typeof value !== "string") {
          value = String(value);
        }
        return value;
      }
      function iteratorFor(items) {
        var iterator = {
          next: function() {
            var value = items.shift();
            return { done: value === undefined, value };
          }
        };
        if (support.iterable) {
          iterator[Symbol.iterator] = function() {
            return iterator;
          };
        }
        return iterator;
      }
      function Headers(headers) {
        this.map = {};
        if (headers instanceof Headers) {
          headers.forEach(function(value, name) {
            this.append(name, value);
          }, this);
        } else if (Array.isArray(headers)) {
          headers.forEach(function(header) {
            this.append(header[0], header[1]);
          }, this);
        } else if (headers) {
          Object.getOwnPropertyNames(headers).forEach(function(name) {
            this.append(name, headers[name]);
          }, this);
        }
      }
      Headers.prototype.append = function(name, value) {
        name = normalizeName(name);
        value = normalizeValue(value);
        var oldValue = this.map[name];
        this.map[name] = oldValue ? oldValue + ", " + value : value;
      };
      Headers.prototype["delete"] = function(name) {
        delete this.map[normalizeName(name)];
      };
      Headers.prototype.get = function(name) {
        name = normalizeName(name);
        return this.has(name) ? this.map[name] : null;
      };
      Headers.prototype.has = function(name) {
        return this.map.hasOwnProperty(normalizeName(name));
      };
      Headers.prototype.set = function(name, value) {
        this.map[normalizeName(name)] = normalizeValue(value);
      };
      Headers.prototype.forEach = function(callback, thisArg) {
        for (var name in this.map) {
          if (this.map.hasOwnProperty(name)) {
            callback.call(thisArg, this.map[name], name, this);
          }
        }
      };
      Headers.prototype.keys = function() {
        var items = [];
        this.forEach(function(value, name) {
          items.push(name);
        });
        return iteratorFor(items);
      };
      Headers.prototype.values = function() {
        var items = [];
        this.forEach(function(value) {
          items.push(value);
        });
        return iteratorFor(items);
      };
      Headers.prototype.entries = function() {
        var items = [];
        this.forEach(function(value, name) {
          items.push([name, value]);
        });
        return iteratorFor(items);
      };
      if (support.iterable) {
        Headers.prototype[Symbol.iterator] = Headers.prototype.entries;
      }
      function consumed(body) {
        if (body.bodyUsed) {
          return Promise.reject(new TypeError("Already read"));
        }
        body.bodyUsed = true;
      }
      function fileReaderReady(reader) {
        return new Promise(function(resolve, reject) {
          reader.onload = function() {
            resolve(reader.result);
          };
          reader.onerror = function() {
            reject(reader.error);
          };
        });
      }
      function readBlobAsArrayBuffer(blob) {
        var reader = new FileReader;
        var promise = fileReaderReady(reader);
        reader.readAsArrayBuffer(blob);
        return promise;
      }
      function readBlobAsText(blob) {
        var reader = new FileReader;
        var promise = fileReaderReady(reader);
        reader.readAsText(blob);
        return promise;
      }
      function readArrayBufferAsText(buf) {
        var view = new Uint8Array(buf);
        var chars = new Array(view.length);
        for (var i = 0;i < view.length; i++) {
          chars[i] = String.fromCharCode(view[i]);
        }
        return chars.join("");
      }
      function bufferClone(buf) {
        if (buf.slice) {
          return buf.slice(0);
        } else {
          var view = new Uint8Array(buf.byteLength);
          view.set(new Uint8Array(buf));
          return view.buffer;
        }
      }
      function Body() {
        this.bodyUsed = false;
        this._initBody = function(body) {
          this._bodyInit = body;
          if (!body) {
            this._bodyText = "";
          } else if (typeof body === "string") {
            this._bodyText = body;
          } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
            this._bodyBlob = body;
          } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
            this._bodyFormData = body;
          } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
            this._bodyText = body.toString();
          } else if (support.arrayBuffer && support.blob && isDataView(body)) {
            this._bodyArrayBuffer = bufferClone(body.buffer);
            this._bodyInit = new Blob([this._bodyArrayBuffer]);
          } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
            this._bodyArrayBuffer = bufferClone(body);
          } else {
            this._bodyText = body = Object.prototype.toString.call(body);
          }
          if (!this.headers.get("content-type")) {
            if (typeof body === "string") {
              this.headers.set("content-type", "text/plain;charset=UTF-8");
            } else if (this._bodyBlob && this._bodyBlob.type) {
              this.headers.set("content-type", this._bodyBlob.type);
            } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
              this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8");
            }
          }
        };
        if (support.blob) {
          this.blob = function() {
            var rejected = consumed(this);
            if (rejected) {
              return rejected;
            }
            if (this._bodyBlob) {
              return Promise.resolve(this._bodyBlob);
            } else if (this._bodyArrayBuffer) {
              return Promise.resolve(new Blob([this._bodyArrayBuffer]));
            } else if (this._bodyFormData) {
              throw new Error("could not read FormData body as blob");
            } else {
              return Promise.resolve(new Blob([this._bodyText]));
            }
          };
          this.arrayBuffer = function() {
            if (this._bodyArrayBuffer) {
              return consumed(this) || Promise.resolve(this._bodyArrayBuffer);
            } else {
              return this.blob().then(readBlobAsArrayBuffer);
            }
          };
        }
        this.text = function() {
          var rejected = consumed(this);
          if (rejected) {
            return rejected;
          }
          if (this._bodyBlob) {
            return readBlobAsText(this._bodyBlob);
          } else if (this._bodyArrayBuffer) {
            return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer));
          } else if (this._bodyFormData) {
            throw new Error("could not read FormData body as text");
          } else {
            return Promise.resolve(this._bodyText);
          }
        };
        if (support.formData) {
          this.formData = function() {
            return this.text().then(decode);
          };
        }
        this.json = function() {
          return this.text().then(JSON.parse);
        };
        return this;
      }
      var methods = ["DELETE", "GET", "HEAD", "OPTIONS", "POST", "PUT"];
      function normalizeMethod(method) {
        var upcased = method.toUpperCase();
        return methods.indexOf(upcased) > -1 ? upcased : method;
      }
      function Request(input, options) {
        options = options || {};
        var body = options.body;
        if (input instanceof Request) {
          if (input.bodyUsed) {
            throw new TypeError("Already read");
          }
          this.url = input.url;
          this.credentials = input.credentials;
          if (!options.headers) {
            this.headers = new Headers(input.headers);
          }
          this.method = input.method;
          this.mode = input.mode;
          this.signal = input.signal;
          if (!body && input._bodyInit != null) {
            body = input._bodyInit;
            input.bodyUsed = true;
          }
        } else {
          this.url = String(input);
        }
        this.credentials = options.credentials || this.credentials || "same-origin";
        if (options.headers || !this.headers) {
          this.headers = new Headers(options.headers);
        }
        this.method = normalizeMethod(options.method || this.method || "GET");
        this.mode = options.mode || this.mode || null;
        this.signal = options.signal || this.signal;
        this.referrer = null;
        if ((this.method === "GET" || this.method === "HEAD") && body) {
          throw new TypeError("Body not allowed for GET or HEAD requests");
        }
        this._initBody(body);
      }
      Request.prototype.clone = function() {
        return new Request(this, { body: this._bodyInit });
      };
      function decode(body) {
        var form = new FormData;
        body.trim().split("&").forEach(function(bytes) {
          if (bytes) {
            var split = bytes.split("=");
            var name = split.shift().replace(/\+/g, " ");
            var value = split.join("=").replace(/\+/g, " ");
            form.append(decodeURIComponent(name), decodeURIComponent(value));
          }
        });
        return form;
      }
      function parseHeaders(rawHeaders) {
        var headers = new Headers;
        var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, " ");
        preProcessedHeaders.split(/\r?\n/).forEach(function(line) {
          var parts = line.split(":");
          var key = parts.shift().trim();
          if (key) {
            var value = parts.join(":").trim();
            headers.append(key, value);
          }
        });
        return headers;
      }
      Body.call(Request.prototype);
      function Response(bodyInit, options) {
        if (!options) {
          options = {};
        }
        this.type = "default";
        this.status = options.status === undefined ? 200 : options.status;
        this.ok = this.status >= 200 && this.status < 300;
        this.statusText = "statusText" in options ? options.statusText : "OK";
        this.headers = new Headers(options.headers);
        this.url = options.url || "";
        this._initBody(bodyInit);
      }
      Body.call(Response.prototype);
      Response.prototype.clone = function() {
        return new Response(this._bodyInit, {
          status: this.status,
          statusText: this.statusText,
          headers: new Headers(this.headers),
          url: this.url
        });
      };
      Response.error = function() {
        var response = new Response(null, { status: 0, statusText: "" });
        response.type = "error";
        return response;
      };
      var redirectStatuses = [301, 302, 303, 307, 308];
      Response.redirect = function(url, status) {
        if (redirectStatuses.indexOf(status) === -1) {
          throw new RangeError("Invalid status code");
        }
        return new Response(null, { status, headers: { location: url } });
      };
      exports2.DOMException = self2.DOMException;
      try {
        new exports2.DOMException;
      } catch (err) {
        exports2.DOMException = function(message, name) {
          this.message = message;
          this.name = name;
          var error = Error(message);
          this.stack = error.stack;
        };
        exports2.DOMException.prototype = Object.create(Error.prototype);
        exports2.DOMException.prototype.constructor = exports2.DOMException;
      }
      function fetch(input, init) {
        return new Promise(function(resolve, reject) {
          var request = new Request(input, init);
          if (request.signal && request.signal.aborted) {
            return reject(new exports2.DOMException("Aborted", "AbortError"));
          }
          var xhr = new XMLHttpRequest;
          function abortXhr() {
            xhr.abort();
          }
          xhr.onload = function() {
            var options = {
              status: xhr.status,
              statusText: xhr.statusText,
              headers: parseHeaders(xhr.getAllResponseHeaders() || "")
            };
            options.url = "responseURL" in xhr ? xhr.responseURL : options.headers.get("X-Request-URL");
            var body = "response" in xhr ? xhr.response : xhr.responseText;
            resolve(new Response(body, options));
          };
          xhr.onerror = function() {
            reject(new TypeError("Network request failed"));
          };
          xhr.ontimeout = function() {
            reject(new TypeError("Network request failed"));
          };
          xhr.onabort = function() {
            reject(new exports2.DOMException("Aborted", "AbortError"));
          };
          xhr.open(request.method, request.url, true);
          if (request.credentials === "include") {
            xhr.withCredentials = true;
          } else if (request.credentials === "omit") {
            xhr.withCredentials = false;
          }
          if ("responseType" in xhr && support.blob) {
            xhr.responseType = "blob";
          }
          request.headers.forEach(function(value, name) {
            xhr.setRequestHeader(name, value);
          });
          if (request.signal) {
            request.signal.addEventListener("abort", abortXhr);
            xhr.onreadystatechange = function() {
              if (xhr.readyState === 4) {
                request.signal.removeEventListener("abort", abortXhr);
              }
            };
          }
          xhr.send(typeof request._bodyInit === "undefined" ? null : request._bodyInit);
        });
      }
      fetch.polyfill = true;
      if (!self2.fetch) {
        self2.fetch = fetch;
        self2.Headers = Headers;
        self2.Request = Request;
        self2.Response = Response;
      }
      exports2.Headers = Headers;
      exports2.Request = Request;
      exports2.Response = Response;
      exports2.fetch = fetch;
      Object.defineProperty(exports2, "__esModule", { value: true });
      return exports2;
    }({});
  })(__self__);
  __self__.fetch.ponyfill = true;
  delete __self__.fetch.polyfill;
  var ctx = __self__;
  exports = ctx.fetch;
  exports.default = ctx.fetch;
  exports.fetch = ctx.fetch;
  exports.Headers = ctx.Headers;
  exports.Request = ctx.Request;
  exports.Response = ctx.Response;
  module.exports = exports;
});

// node_modules/fast-xml-parser/src/util.js
var require_util = __commonJS((exports) => {
  var nameStartChar = ":A-Za-z_\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD";
  var nameChar = nameStartChar + "\\-.\\d\\u00B7\\u0300-\\u036F\\u203F-\\u2040";
  var nameRegexp = "[" + nameStartChar + "][" + nameChar + "]*";
  var regexName = new RegExp("^" + nameRegexp + "$");
  var getAllMatches = function(string, regex) {
    const matches = [];
    let match = regex.exec(string);
    while (match) {
      const allmatches = [];
      allmatches.startIndex = regex.lastIndex - match[0].length;
      const len = match.length;
      for (let index = 0;index < len; index++) {
        allmatches.push(match[index]);
      }
      matches.push(allmatches);
      match = regex.exec(string);
    }
    return matches;
  };
  var isName = function(string) {
    const match = regexName.exec(string);
    return !(match === null || typeof match === "undefined");
  };
  exports.isExist = function(v) {
    return typeof v !== "undefined";
  };
  exports.isEmptyObject = function(obj) {
    return Object.keys(obj).length === 0;
  };
  exports.merge = function(target, a, arrayMode) {
    if (a) {
      const keys = Object.keys(a);
      const len = keys.length;
      for (let i = 0;i < len; i++) {
        if (arrayMode === "strict") {
          target[keys[i]] = [a[keys[i]]];
        } else {
          target[keys[i]] = a[keys[i]];
        }
      }
    }
  };
  exports.getValue = function(v) {
    if (exports.isExist(v)) {
      return v;
    } else {
      return "";
    }
  };
  exports.buildOptions = function(options, defaultOptions, props) {
    let newOptions = {};
    if (!options) {
      return defaultOptions;
    }
    for (let i = 0;i < props.length; i++) {
      if (options[props[i]] !== undefined) {
        newOptions[props[i]] = options[props[i]];
      } else {
        newOptions[props[i]] = defaultOptions[props[i]];
      }
    }
    return newOptions;
  };
  exports.isTagNameInArrayMode = function(tagName, arrayMode, parentTagName) {
    if (arrayMode === false) {
      return false;
    } else if (arrayMode instanceof RegExp) {
      return arrayMode.test(tagName);
    } else if (typeof arrayMode === "function") {
      return !!arrayMode(tagName, parentTagName);
    }
    return arrayMode === "strict";
  };
  exports.isName = isName;
  exports.getAllMatches = getAllMatches;
  exports.nameRegexp = nameRegexp;
});

// node_modules/fast-xml-parser/src/node2json.js
var require_node2json = __commonJS((exports) => {
  var util = require_util();
  var convertToJson = function(node, options, parentTagName) {
    const jObj = {};
    if (!options.alwaysCreateTextNode && (!node.child || util.isEmptyObject(node.child)) && (!node.attrsMap || util.isEmptyObject(node.attrsMap))) {
      return util.isExist(node.val) ? node.val : "";
    }
    if (util.isExist(node.val) && !(typeof node.val === "string" && (node.val === "" || node.val === options.cdataPositionChar))) {
      const asArray = util.isTagNameInArrayMode(node.tagname, options.arrayMode, parentTagName);
      jObj[options.textNodeName] = asArray ? [node.val] : node.val;
    }
    util.merge(jObj, node.attrsMap, options.arrayMode);
    const keys = Object.keys(node.child);
    for (let index = 0;index < keys.length; index++) {
      const tagName = keys[index];
      if (node.child[tagName] && node.child[tagName].length > 1) {
        jObj[tagName] = [];
        for (let tag in node.child[tagName]) {
          if (node.child[tagName].hasOwnProperty(tag)) {
            jObj[tagName].push(convertToJson(node.child[tagName][tag], options, tagName));
          }
        }
      } else {
        const result = convertToJson(node.child[tagName][0], options, tagName);
        const asArray = options.arrayMode === true && typeof result === "object" || util.isTagNameInArrayMode(tagName, options.arrayMode, parentTagName);
        jObj[tagName] = asArray ? [result] : result;
      }
    }
    return jObj;
  };
  exports.convertToJson = convertToJson;
});

// node_modules/fast-xml-parser/src/xmlNode.js
var require_xmlNode = __commonJS((exports, module) => {
  module.exports = function(tagname, parent2, val) {
    this.tagname = tagname;
    this.parent = parent2;
    this.child = {};
    this.attrsMap = {};
    this.val = val;
    this.addChild = function(child) {
      if (Array.isArray(this.child[child.tagname])) {
        this.child[child.tagname].push(child);
      } else {
        this.child[child.tagname] = [child];
      }
    };
  };
});

// node_modules/strnum/strnum.js
var require_strnum = __commonJS((exports, module) => {
  var toNumber = function(str, options = {}) {
    options = Object.assign({}, consider, options);
    if (!str || typeof str !== "string")
      return str;
    let trimmedStr = str.trim();
    if (options.skipLike !== undefined && options.skipLike.test(trimmedStr))
      return str;
    else if (options.hex && hexRegex.test(trimmedStr)) {
      return Number.parseInt(trimmedStr, 16);
    } else {
      const match = numRegex.exec(trimmedStr);
      if (match) {
        const sign = match[1];
        const leadingZeros = match[2];
        let numTrimmedByZeros = trimZeros(match[3]);
        const eNotation = match[4] || match[6];
        if (!options.leadingZeros && leadingZeros.length > 0 && sign && trimmedStr[2] !== ".")
          return str;
        else if (!options.leadingZeros && leadingZeros.length > 0 && !sign && trimmedStr[1] !== ".")
          return str;
        else {
          const num = Number(trimmedStr);
          const numStr = "" + num;
          if (numStr.search(/[eE]/) !== -1) {
            if (options.eNotation)
              return num;
            else
              return str;
          } else if (eNotation) {
            if (options.eNotation)
              return num;
            else
              return str;
          } else if (trimmedStr.indexOf(".") !== -1) {
            if (numStr === "0" && numTrimmedByZeros === "")
              return num;
            else if (numStr === numTrimmedByZeros)
              return num;
            else if (sign && numStr === "-" + numTrimmedByZeros)
              return num;
            else
              return str;
          }
          if (leadingZeros) {
            if (numTrimmedByZeros === numStr)
              return num;
            else if (sign + numTrimmedByZeros === numStr)
              return num;
            else
              return str;
          }
          if (trimmedStr === numStr)
            return num;
          else if (trimmedStr === sign + numStr)
            return num;
          return str;
        }
      } else {
        return str;
      }
    }
  };
  var trimZeros = function(numStr) {
    if (numStr && numStr.indexOf(".") !== -1) {
      numStr = numStr.replace(/0+$/, "");
      if (numStr === ".")
        numStr = "0";
      else if (numStr[0] === ".")
        numStr = "0" + numStr;
      else if (numStr[numStr.length - 1] === ".")
        numStr = numStr.substr(0, numStr.length - 1);
      return numStr;
    }
    return numStr;
  };
  var hexRegex = /^[-+]?0x[a-fA-F0-9]+$/;
  var numRegex = /^([\-\+])?(0*)(\.[0-9]+([eE]\-?[0-9]+)?|[0-9]+(\.[0-9]+([eE]\-?[0-9]+)?)?)$/;
  if (!Number.parseInt && window.parseInt) {
    Number.parseInt = window.parseInt;
  }
  if (!Number.parseFloat && window.parseFloat) {
    Number.parseFloat = window.parseFloat;
  }
  var consider = {
    hex: true,
    leadingZeros: true,
    decimalPoint: ".",
    eNotation: true
  };
  module.exports = toNumber;
});

// node_modules/fast-xml-parser/src/xmlstr2xmlnode.js
var require_xmlstr2xmlnode = __commonJS((exports) => {
  var processTagValue = function(tagName, val, options) {
    if (val) {
      if (options.trimValues) {
        val = val.trim();
      }
      val = options.tagValueProcessor(val, tagName);
      val = parseValue(val, options.parseNodeValue, options.numParseOptions);
    }
    return val;
  };
  var resolveNameSpace = function(tagname, options) {
    if (options.ignoreNameSpace) {
      const tags = tagname.split(":");
      const prefix = tagname.charAt(0) === "/" ? "/" : "";
      if (tags[0] === "xmlns") {
        return "";
      }
      if (tags.length === 2) {
        tagname = prefix + tags[1];
      }
    }
    return tagname;
  };
  var parseValue = function(val, shouldParse, options) {
    if (shouldParse && typeof val === "string") {
      const newval = val.trim();
      if (newval === "true")
        return true;
      else if (newval === "false")
        return false;
      else
        return toNumber(val, options);
    } else {
      if (util.isExist(val)) {
        return val;
      } else {
        return "";
      }
    }
  };
  var buildAttributesMap = function(attrStr, options) {
    if (!options.ignoreAttributes && typeof attrStr === "string") {
      attrStr = attrStr.replace(/\r?\n/g, " ");
      const matches = util.getAllMatches(attrStr, attrsRegx);
      const len = matches.length;
      const attrs = {};
      for (let i = 0;i < len; i++) {
        const attrName = resolveNameSpace(matches[i][1], options);
        if (attrName.length) {
          if (matches[i][4] !== undefined) {
            if (options.trimValues) {
              matches[i][4] = matches[i][4].trim();
            }
            matches[i][4] = options.attrValueProcessor(matches[i][4], attrName);
            attrs[options.attributeNamePrefix + attrName] = parseValue(matches[i][4], options.parseAttributeValue, options.numParseOptions);
          } else if (options.allowBooleanAttributes) {
            attrs[options.attributeNamePrefix + attrName] = true;
          }
        }
      }
      if (!Object.keys(attrs).length) {
        return;
      }
      if (options.attrNodeName) {
        const attrCollection = {};
        attrCollection[options.attrNodeName] = attrs;
        return attrCollection;
      }
      return attrs;
    }
  };
  var closingIndexForOpeningTag = function(data, i) {
    let attrBoundary;
    let tagExp = "";
    for (let index = i;index < data.length; index++) {
      let ch = data[index];
      if (attrBoundary) {
        if (ch === attrBoundary)
          attrBoundary = "";
      } else if (ch === '"' || ch === "'") {
        attrBoundary = ch;
      } else if (ch === ">") {
        return {
          data: tagExp,
          index
        };
      } else if (ch === "\t") {
        ch = " ";
      }
      tagExp += ch;
    }
  };
  var findClosingIndex = function(xmlData, str, i, errMsg) {
    const closingIndex = xmlData.indexOf(str, i);
    if (closingIndex === -1) {
      throw new Error(errMsg);
    } else {
      return closingIndex + str.length - 1;
    }
  };
  var util = require_util();
  var buildOptions = require_util().buildOptions;
  var xmlNode = require_xmlNode();
  var toNumber = require_strnum();
  var regx = "<((!\\[CDATA\\[([\\s\\S]*?)(]]>))|((NAME:)?(NAME))([^>]*)>|((\\/)(NAME)\\s*>))([^<]*)".replace(/NAME/g, util.nameRegexp);
  if (!Number.parseInt && window.parseInt) {
    Number.parseInt = window.parseInt;
  }
  if (!Number.parseFloat && window.parseFloat) {
    Number.parseFloat = window.parseFloat;
  }
  var defaultOptions = {
    attributeNamePrefix: "@_",
    attrNodeName: false,
    textNodeName: "#text",
    ignoreAttributes: true,
    ignoreNameSpace: false,
    allowBooleanAttributes: false,
    parseNodeValue: true,
    parseAttributeValue: false,
    arrayMode: false,
    trimValues: true,
    cdataTagName: false,
    cdataPositionChar: "\\c",
    numParseOptions: {
      hex: true,
      leadingZeros: true
    },
    tagValueProcessor: function(a, tagName) {
      return a;
    },
    attrValueProcessor: function(a, attrName) {
      return a;
    },
    stopNodes: [],
    alwaysCreateTextNode: false
  };
  exports.defaultOptions = defaultOptions;
  var props = [
    "attributeNamePrefix",
    "attrNodeName",
    "textNodeName",
    "ignoreAttributes",
    "ignoreNameSpace",
    "allowBooleanAttributes",
    "parseNodeValue",
    "parseAttributeValue",
    "arrayMode",
    "trimValues",
    "cdataTagName",
    "cdataPositionChar",
    "tagValueProcessor",
    "attrValueProcessor",
    "parseTrueNumberOnly",
    "numParseOptions",
    "stopNodes",
    "alwaysCreateTextNode"
  ];
  exports.props = props;
  var attrsRegx = new RegExp('([^\\s=]+)\\s*(=\\s*([\'"])(.*?)\\3)?', "g");
  var getTraversalObj = function(xmlData, options) {
    xmlData = xmlData.replace(/\r\n?/g, "\n");
    options = buildOptions(options, defaultOptions, props);
    const xmlObj = new xmlNode("!xml");
    let currentNode = xmlObj;
    let textData = "";
    for (let i = 0;i < xmlData.length; i++) {
      const ch = xmlData[i];
      if (ch === "<") {
        if (xmlData[i + 1] === "/") {
          const closeIndex = findClosingIndex(xmlData, ">", i, "Closing Tag is not closed.");
          let tagName = xmlData.substring(i + 2, closeIndex).trim();
          if (options.ignoreNameSpace) {
            const colonIndex = tagName.indexOf(":");
            if (colonIndex !== -1) {
              tagName = tagName.substr(colonIndex + 1);
            }
          }
          if (currentNode) {
            if (currentNode.val) {
              currentNode.val = util.getValue(currentNode.val) + "" + processTagValue(tagName, textData, options);
            } else {
              currentNode.val = processTagValue(tagName, textData, options);
            }
          }
          if (options.stopNodes.length && options.stopNodes.includes(currentNode.tagname)) {
            currentNode.child = [];
            if (currentNode.attrsMap == undefined) {
              currentNode.attrsMap = {};
            }
            currentNode.val = xmlData.substr(currentNode.startIndex + 1, i - currentNode.startIndex - 1);
          }
          currentNode = currentNode.parent;
          textData = "";
          i = closeIndex;
        } else if (xmlData[i + 1] === "?") {
          i = findClosingIndex(xmlData, "?>", i, "Pi Tag is not closed.");
        } else if (xmlData.substr(i + 1, 3) === "!--") {
          i = findClosingIndex(xmlData, "-->", i, "Comment is not closed.");
        } else if (xmlData.substr(i + 1, 2) === "!D") {
          const closeIndex = findClosingIndex(xmlData, ">", i, "DOCTYPE is not closed.");
          const tagExp = xmlData.substring(i, closeIndex);
          if (tagExp.indexOf("[") >= 0) {
            i = xmlData.indexOf("]>", i) + 1;
          } else {
            i = closeIndex;
          }
        } else if (xmlData.substr(i + 1, 2) === "![") {
          const closeIndex = findClosingIndex(xmlData, "]]>", i, "CDATA is not closed.") - 2;
          const tagExp = xmlData.substring(i + 9, closeIndex);
          if (textData) {
            currentNode.val = util.getValue(currentNode.val) + "" + processTagValue(currentNode.tagname, textData, options);
            textData = "";
          }
          if (options.cdataTagName) {
            const childNode = new xmlNode(options.cdataTagName, currentNode, tagExp);
            currentNode.addChild(childNode);
            currentNode.val = util.getValue(currentNode.val) + options.cdataPositionChar;
            if (tagExp) {
              childNode.val = tagExp;
            }
          } else {
            currentNode.val = (currentNode.val || "") + (tagExp || "");
          }
          i = closeIndex + 2;
        } else {
          const result = closingIndexForOpeningTag(xmlData, i + 1);
          let tagExp = result.data;
          const closeIndex = result.index;
          const separatorIndex = tagExp.indexOf(" ");
          let tagName = tagExp;
          let shouldBuildAttributesMap = true;
          if (separatorIndex !== -1) {
            tagName = tagExp.substr(0, separatorIndex).replace(/\s\s*$/, "");
            tagExp = tagExp.substr(separatorIndex + 1);
          }
          if (options.ignoreNameSpace) {
            const colonIndex = tagName.indexOf(":");
            if (colonIndex !== -1) {
              tagName = tagName.substr(colonIndex + 1);
              shouldBuildAttributesMap = tagName !== result.data.substr(colonIndex + 1);
            }
          }
          if (currentNode && textData) {
            if (currentNode.tagname !== "!xml") {
              currentNode.val = util.getValue(currentNode.val) + "" + processTagValue(currentNode.tagname, textData, options);
            }
          }
          if (tagExp.length > 0 && tagExp.lastIndexOf("/") === tagExp.length - 1) {
            if (tagName[tagName.length - 1] === "/") {
              tagName = tagName.substr(0, tagName.length - 1);
              tagExp = tagName;
            } else {
              tagExp = tagExp.substr(0, tagExp.length - 1);
            }
            const childNode = new xmlNode(tagName, currentNode, "");
            if (tagName !== tagExp) {
              childNode.attrsMap = buildAttributesMap(tagExp, options);
            }
            currentNode.addChild(childNode);
          } else {
            const childNode = new xmlNode(tagName, currentNode);
            if (options.stopNodes.length && options.stopNodes.includes(childNode.tagname)) {
              childNode.startIndex = closeIndex;
            }
            if (tagName !== tagExp && shouldBuildAttributesMap) {
              childNode.attrsMap = buildAttributesMap(tagExp, options);
            }
            currentNode.addChild(childNode);
            currentNode = childNode;
          }
          textData = "";
          i = closeIndex;
        }
      } else {
        textData += xmlData[i];
      }
    }
    return xmlObj;
  };
  exports.getTraversalObj = getTraversalObj;
});

// node_modules/fast-xml-parser/src/validator.js
var require_validator = __commonJS((exports) => {
  var readPI = function(xmlData, i) {
    const start = i;
    for (;i < xmlData.length; i++) {
      if (xmlData[i] == "?" || xmlData[i] == " ") {
        const tagname = xmlData.substr(start, i - start);
        if (i > 5 && tagname === "xml") {
          return getErrorObject("InvalidXml", "XML declaration allowed only at the start of the document.", getLineNumberForPosition(xmlData, i));
        } else if (xmlData[i] == "?" && xmlData[i + 1] == ">") {
          i++;
          break;
        } else {
          continue;
        }
      }
    }
    return i;
  };
  var readCommentAndCDATA = function(xmlData, i) {
    if (xmlData.length > i + 5 && xmlData[i + 1] === "-" && xmlData[i + 2] === "-") {
      for (i += 3;i < xmlData.length; i++) {
        if (xmlData[i] === "-" && xmlData[i + 1] === "-" && xmlData[i + 2] === ">") {
          i += 2;
          break;
        }
      }
    } else if (xmlData.length > i + 8 && xmlData[i + 1] === "D" && xmlData[i + 2] === "O" && xmlData[i + 3] === "C" && xmlData[i + 4] === "T" && xmlData[i + 5] === "Y" && xmlData[i + 6] === "P" && xmlData[i + 7] === "E") {
      let angleBracketsCount = 1;
      for (i += 8;i < xmlData.length; i++) {
        if (xmlData[i] === "<") {
          angleBracketsCount++;
        } else if (xmlData[i] === ">") {
          angleBracketsCount--;
          if (angleBracketsCount === 0) {
            break;
          }
        }
      }
    } else if (xmlData.length > i + 9 && xmlData[i + 1] === "[" && xmlData[i + 2] === "C" && xmlData[i + 3] === "D" && xmlData[i + 4] === "A" && xmlData[i + 5] === "T" && xmlData[i + 6] === "A" && xmlData[i + 7] === "[") {
      for (i += 8;i < xmlData.length; i++) {
        if (xmlData[i] === "]" && xmlData[i + 1] === "]" && xmlData[i + 2] === ">") {
          i += 2;
          break;
        }
      }
    }
    return i;
  };
  var readAttributeStr = function(xmlData, i) {
    let attrStr = "";
    let startChar = "";
    let tagClosed = false;
    for (;i < xmlData.length; i++) {
      if (xmlData[i] === doubleQuote || xmlData[i] === singleQuote) {
        if (startChar === "") {
          startChar = xmlData[i];
        } else if (startChar !== xmlData[i]) {
        } else {
          startChar = "";
        }
      } else if (xmlData[i] === ">") {
        if (startChar === "") {
          tagClosed = true;
          break;
        }
      }
      attrStr += xmlData[i];
    }
    if (startChar !== "") {
      return false;
    }
    return {
      value: attrStr,
      index: i,
      tagClosed
    };
  };
  var validateAttributeString = function(attrStr, options) {
    const matches = util.getAllMatches(attrStr, validAttrStrRegxp);
    const attrNames = {};
    for (let i = 0;i < matches.length; i++) {
      if (matches[i][1].length === 0) {
        return getErrorObject("InvalidAttr", "Attribute '" + matches[i][2] + "' has no space in starting.", getPositionFromMatch(matches[i]));
      } else if (matches[i][3] === undefined && !options.allowBooleanAttributes) {
        return getErrorObject("InvalidAttr", "boolean attribute '" + matches[i][2] + "' is not allowed.", getPositionFromMatch(matches[i]));
      }
      const attrName = matches[i][2];
      if (!validateAttrName(attrName)) {
        return getErrorObject("InvalidAttr", "Attribute '" + attrName + "' is an invalid name.", getPositionFromMatch(matches[i]));
      }
      if (!attrNames.hasOwnProperty(attrName)) {
        attrNames[attrName] = 1;
      } else {
        return getErrorObject("InvalidAttr", "Attribute '" + attrName + "' is repeated.", getPositionFromMatch(matches[i]));
      }
    }
    return true;
  };
  var validateNumberAmpersand = function(xmlData, i) {
    let re = /\d/;
    if (xmlData[i] === "x") {
      i++;
      re = /[\da-fA-F]/;
    }
    for (;i < xmlData.length; i++) {
      if (xmlData[i] === ";")
        return i;
      if (!xmlData[i].match(re))
        break;
    }
    return -1;
  };
  var validateAmpersand = function(xmlData, i) {
    i++;
    if (xmlData[i] === ";")
      return -1;
    if (xmlData[i] === "#") {
      i++;
      return validateNumberAmpersand(xmlData, i);
    }
    let count = 0;
    for (;i < xmlData.length; i++, count++) {
      if (xmlData[i].match(/\w/) && count < 20)
        continue;
      if (xmlData[i] === ";")
        break;
      return -1;
    }
    return i;
  };
  var getErrorObject = function(code, message, lineNumber) {
    return {
      err: {
        code,
        msg: message,
        line: lineNumber.line || lineNumber,
        col: lineNumber.col
      }
    };
  };
  var validateAttrName = function(attrName) {
    return util.isName(attrName);
  };
  var validateTagName = function(tagname) {
    return util.isName(tagname);
  };
  var getLineNumberForPosition = function(xmlData, index) {
    const lines = xmlData.substring(0, index).split(/\r?\n/);
    return {
      line: lines.length,
      col: lines[lines.length - 1].length + 1
    };
  };
  var getPositionFromMatch = function(match) {
    return match.startIndex + match[1].length;
  };
  var util = require_util();
  var defaultOptions = {
    allowBooleanAttributes: false
  };
  var props = ["allowBooleanAttributes"];
  exports.validate = function(xmlData, options) {
    options = util.buildOptions(options, defaultOptions, props);
    const tags = [];
    let tagFound = false;
    let reachedRoot = false;
    if (xmlData[0] === "\uFEFF") {
      xmlData = xmlData.substr(1);
    }
    for (let i = 0;i < xmlData.length; i++) {
      if (xmlData[i] === "<" && xmlData[i + 1] === "?") {
        i += 2;
        i = readPI(xmlData, i);
        if (i.err)
          return i;
      } else if (xmlData[i] === "<") {
        let tagStartPos = i;
        i++;
        if (xmlData[i] === "!") {
          i = readCommentAndCDATA(xmlData, i);
          continue;
        } else {
          let closingTag = false;
          if (xmlData[i] === "/") {
            closingTag = true;
            i++;
          }
          let tagName = "";
          for (;i < xmlData.length && xmlData[i] !== ">" && xmlData[i] !== " " && xmlData[i] !== "\t" && xmlData[i] !== "\n" && xmlData[i] !== "\r"; i++) {
            tagName += xmlData[i];
          }
          tagName = tagName.trim();
          if (tagName[tagName.length - 1] === "/") {
            tagName = tagName.substring(0, tagName.length - 1);
            i--;
          }
          if (!validateTagName(tagName)) {
            let msg;
            if (tagName.trim().length === 0) {
              msg = "Invalid space after '<'.";
            } else {
              msg = "Tag '" + tagName + "' is an invalid name.";
            }
            return getErrorObject("InvalidTag", msg, getLineNumberForPosition(xmlData, i));
          }
          const result = readAttributeStr(xmlData, i);
          if (result === false) {
            return getErrorObject("InvalidAttr", "Attributes for '" + tagName + "' have open quote.", getLineNumberForPosition(xmlData, i));
          }
          let attrStr = result.value;
          i = result.index;
          if (attrStr[attrStr.length - 1] === "/") {
            const attrStrStart = i - attrStr.length;
            attrStr = attrStr.substring(0, attrStr.length - 1);
            const isValid = validateAttributeString(attrStr, options);
            if (isValid === true) {
              tagFound = true;
            } else {
              return getErrorObject(isValid.err.code, isValid.err.msg, getLineNumberForPosition(xmlData, attrStrStart + isValid.err.line));
            }
          } else if (closingTag) {
            if (!result.tagClosed) {
              return getErrorObject("InvalidTag", "Closing tag '" + tagName + "' doesn't have proper closing.", getLineNumberForPosition(xmlData, i));
            } else if (attrStr.trim().length > 0) {
              return getErrorObject("InvalidTag", "Closing tag '" + tagName + "' can't have attributes or invalid starting.", getLineNumberForPosition(xmlData, tagStartPos));
            } else {
              const otg = tags.pop();
              if (tagName !== otg.tagName) {
                let openPos = getLineNumberForPosition(xmlData, otg.tagStartPos);
                return getErrorObject("InvalidTag", "Expected closing tag '" + otg.tagName + "' (opened in line " + openPos.line + ", col " + openPos.col + ") instead of closing tag '" + tagName + "'.", getLineNumberForPosition(xmlData, tagStartPos));
              }
              if (tags.length == 0) {
                reachedRoot = true;
              }
            }
          } else {
            const isValid = validateAttributeString(attrStr, options);
            if (isValid !== true) {
              return getErrorObject(isValid.err.code, isValid.err.msg, getLineNumberForPosition(xmlData, i - attrStr.length + isValid.err.line));
            }
            if (reachedRoot === true) {
              return getErrorObject("InvalidXml", "Multiple possible root nodes found.", getLineNumberForPosition(xmlData, i));
            } else {
              tags.push({ tagName, tagStartPos });
            }
            tagFound = true;
          }
          for (i++;i < xmlData.length; i++) {
            if (xmlData[i] === "<") {
              if (xmlData[i + 1] === "!") {
                i++;
                i = readCommentAndCDATA(xmlData, i);
                continue;
              } else if (xmlData[i + 1] === "?") {
                i = readPI(xmlData, ++i);
                if (i.err)
                  return i;
              } else {
                break;
              }
            } else if (xmlData[i] === "&") {
              const afterAmp = validateAmpersand(xmlData, i);
              if (afterAmp == -1)
                return getErrorObject("InvalidChar", "char '&' is not expected.", getLineNumberForPosition(xmlData, i));
              i = afterAmp;
            }
          }
          if (xmlData[i] === "<") {
            i--;
          }
        }
      } else {
        if (xmlData[i] === " " || xmlData[i] === "\t" || xmlData[i] === "\n" || xmlData[i] === "\r") {
          continue;
        }
        return getErrorObject("InvalidChar", "char '" + xmlData[i] + "' is not expected.", getLineNumberForPosition(xmlData, i));
      }
    }
    if (!tagFound) {
      return getErrorObject("InvalidXml", "Start tag expected.", 1);
    } else if (tags.length == 1) {
      return getErrorObject("InvalidTag", "Unclosed tag '" + tags[0].tagName + "'.", getLineNumberForPosition(xmlData, tags[0].tagStartPos));
    } else if (tags.length > 0) {
      return getErrorObject("InvalidXml", "Invalid '" + JSON.stringify(tags.map((t) => t.tagName), null, 4).replace(/\r?\n/g, "") + "' found.", { line: 1, col: 1 });
    }
    return true;
  };
  var doubleQuote = '"';
  var singleQuote = "'";
  var validAttrStrRegxp = new RegExp('(\\s*)([^\\s=]+)(\\s*=)?(\\s*([\'"])(([\\s\\S])*?)\\5)?', "g");
});

// node_modules/fast-xml-parser/src/nimndata.js
var require_nimndata = __commonJS((exports) => {
  var hasData = function(jObj) {
    if (jObj === undefined) {
      return chars.missingChar;
    } else if (jObj === null) {
      return chars.nilChar;
    } else if (jObj.child && Object.keys(jObj.child).length === 0 && (!jObj.attrsMap || Object.keys(jObj.attrsMap).length === 0)) {
      return chars.emptyChar;
    } else {
      return true;
    }
  };
  var char = function(a) {
    return String.fromCharCode(a);
  };
  var chars = {
    nilChar: char(176),
    missingChar: char(201),
    nilPremitive: char(175),
    missingPremitive: char(200),
    emptyChar: char(178),
    emptyValue: char(177),
    boundryChar: char(179),
    objStart: char(198),
    arrStart: char(204),
    arrayEnd: char(185)
  };
  var charsArr = [
    chars.nilChar,
    chars.nilPremitive,
    chars.missingChar,
    chars.missingPremitive,
    chars.boundryChar,
    chars.emptyChar,
    chars.emptyValue,
    chars.arrayEnd,
    chars.objStart,
    chars.arrStart
  ];
  var _e = function(node, e_schema, options) {
    if (typeof e_schema === "string") {
      if (node && node[0] && node[0].val !== undefined) {
        return getValue(node[0].val, e_schema);
      } else {
        return getValue(node, e_schema);
      }
    } else {
      const hasValidData = hasData(node);
      if (hasValidData === true) {
        let str = "";
        if (Array.isArray(e_schema)) {
          str += chars.arrStart;
          const itemSchema = e_schema[0];
          const arr_len = node.length;
          if (typeof itemSchema === "string") {
            for (let arr_i = 0;arr_i < arr_len; arr_i++) {
              const r = getValue(node[arr_i].val, itemSchema);
              str = processValue(str, r);
            }
          } else {
            for (let arr_i = 0;arr_i < arr_len; arr_i++) {
              const r = _e(node[arr_i], itemSchema, options);
              str = processValue(str, r);
            }
          }
          str += chars.arrayEnd;
        } else {
          str += chars.objStart;
          const keys = Object.keys(e_schema);
          if (Array.isArray(node)) {
            node = node[0];
          }
          for (let i in keys) {
            const key = keys[i];
            let r;
            if (!options.ignoreAttributes && node.attrsMap && node.attrsMap[key]) {
              r = _e(node.attrsMap[key], e_schema[key], options);
            } else if (key === options.textNodeName) {
              r = _e(node.val, e_schema[key], options);
            } else {
              r = _e(node.child[key], e_schema[key], options);
            }
            str = processValue(str, r);
          }
        }
        return str;
      } else {
        return hasValidData;
      }
    }
  };
  var getValue = function(a) {
    switch (a) {
      case undefined:
        return chars.missingPremitive;
      case null:
        return chars.nilPremitive;
      case "":
        return chars.emptyValue;
      default:
        return a;
    }
  };
  var processValue = function(str, r) {
    if (!isAppChar(r[0]) && !isAppChar(str[str.length - 1])) {
      str += chars.boundryChar;
    }
    return str + r;
  };
  var isAppChar = function(ch) {
    return charsArr.indexOf(ch) !== -1;
  };
  var x2j = require_xmlstr2xmlnode();
  var buildOptions = require_util().buildOptions;
  var convert2nimn = function(node, e_schema, options) {
    options = buildOptions(options, x2j.defaultOptions, x2j.props);
    return _e(node, e_schema, options);
  };
  exports.convert2nimn = convert2nimn;
});

// node_modules/fast-xml-parser/src/node2json_str.js
var require_node2json_str = __commonJS((exports) => {
  var stringval = function(v) {
    if (v === true || v === false || !isNaN(v)) {
      return v;
    } else {
      return '"' + v + '"';
    }
  };
  var util = require_util();
  var buildOptions = require_util().buildOptions;
  var x2j = require_xmlstr2xmlnode();
  var convertToJsonString = function(node, options) {
    options = buildOptions(options, x2j.defaultOptions, x2j.props);
    options.indentBy = options.indentBy || "";
    return _cToJsonStr(node, options, 0);
  };
  var _cToJsonStr = function(node, options, level) {
    let jObj = "{";
    const keys = Object.keys(node.child);
    for (let index = 0;index < keys.length; index++) {
      const tagname = keys[index];
      if (node.child[tagname] && node.child[tagname].length > 1) {
        jObj += '"' + tagname + '" : [ ';
        for (let tag in node.child[tagname]) {
          jObj += _cToJsonStr(node.child[tagname][tag], options) + " , ";
        }
        jObj = jObj.substr(0, jObj.length - 1) + " ] ";
      } else {
        jObj += '"' + tagname + '" : ' + _cToJsonStr(node.child[tagname][0], options) + " ,";
      }
    }
    util.merge(jObj, node.attrsMap);
    if (util.isEmptyObject(jObj)) {
      return util.isExist(node.val) ? node.val : "";
    } else {
      if (util.isExist(node.val)) {
        if (!(typeof node.val === "string" && (node.val === "" || node.val === options.cdataPositionChar))) {
          jObj += '"' + options.textNodeName + '" : ' + stringval(node.val);
        }
      }
    }
    if (jObj[jObj.length - 1] === ",") {
      jObj = jObj.substr(0, jObj.length - 2);
    }
    return jObj + "}";
  };
  exports.convertToJsonString = convertToJsonString;
});

// node_modules/fast-xml-parser/src/json2xml.js
var require_json2xml = __commonJS((exports, module) => {
  var Parser = function(options) {
    this.options = buildOptions(options, defaultOptions, props);
    if (this.options.ignoreAttributes || this.options.attrNodeName) {
      this.isAttribute = function() {
        return false;
      };
    } else {
      this.attrPrefixLen = this.options.attributeNamePrefix.length;
      this.isAttribute = isAttribute;
    }
    if (this.options.cdataTagName) {
      this.isCDATA = isCDATA;
    } else {
      this.isCDATA = function() {
        return false;
      };
    }
    this.replaceCDATAstr = replaceCDATAstr;
    this.replaceCDATAarr = replaceCDATAarr;
    this.processTextOrObjNode = processTextOrObjNode;
    if (this.options.format) {
      this.indentate = indentate;
      this.tagEndChar = ">\n";
      this.newLine = "\n";
    } else {
      this.indentate = function() {
        return "";
      };
      this.tagEndChar = ">";
      this.newLine = "";
    }
    if (this.options.supressEmptyNode) {
      this.buildTextNode = buildEmptyTextNode;
      this.buildObjNode = buildEmptyObjNode;
    } else {
      this.buildTextNode = buildTextValNode;
      this.buildObjNode = buildObjectNode;
    }
    this.buildTextValNode = buildTextValNode;
    this.buildObjectNode = buildObjectNode;
  };
  var processTextOrObjNode = function(object, key, level) {
    const result = this.j2x(object, level + 1);
    if (object[this.options.textNodeName] !== undefined && Object.keys(object).length === 1) {
      return this.buildTextNode(result.val, key, result.attrStr, level);
    } else {
      return this.buildObjNode(result.val, key, result.attrStr, level);
    }
  };
  var replaceCDATAstr = function(str, cdata) {
    str = this.options.tagValueProcessor("" + str);
    if (this.options.cdataPositionChar === "" || str === "") {
      return str + "<![CDATA[" + cdata + "]]" + this.tagEndChar;
    } else {
      return str.replace(this.options.cdataPositionChar, "<![CDATA[" + cdata + "]]" + this.tagEndChar);
    }
  };
  var replaceCDATAarr = function(str, cdata) {
    str = this.options.tagValueProcessor("" + str);
    if (this.options.cdataPositionChar === "" || str === "") {
      return str + "<![CDATA[" + cdata.join("]]><![CDATA[") + "]]" + this.tagEndChar;
    } else {
      for (let v in cdata) {
        str = str.replace(this.options.cdataPositionChar, "<![CDATA[" + cdata[v] + "]]>");
      }
      return str + this.newLine;
    }
  };
  var buildObjectNode = function(val, key, attrStr, level) {
    if (attrStr && val.indexOf("<") === -1) {
      return this.indentate(level) + "<" + key + attrStr + ">" + val + "</" + key + this.tagEndChar;
    } else {
      return this.indentate(level) + "<" + key + attrStr + this.tagEndChar + val + this.indentate(level) + "</" + key + this.tagEndChar;
    }
  };
  var buildEmptyObjNode = function(val, key, attrStr, level) {
    if (val !== "") {
      return this.buildObjectNode(val, key, attrStr, level);
    } else {
      return this.indentate(level) + "<" + key + attrStr + "/" + this.tagEndChar;
    }
  };
  var buildTextValNode = function(val, key, attrStr, level) {
    return this.indentate(level) + "<" + key + attrStr + ">" + this.options.tagValueProcessor(val) + "</" + key + this.tagEndChar;
  };
  var buildEmptyTextNode = function(val, key, attrStr, level) {
    if (val !== "") {
      return this.buildTextValNode(val, key, attrStr, level);
    } else {
      return this.indentate(level) + "<" + key + attrStr + "/" + this.tagEndChar;
    }
  };
  var indentate = function(level) {
    return this.options.indentBy.repeat(level);
  };
  var isAttribute = function(name) {
    if (name.startsWith(this.options.attributeNamePrefix)) {
      return name.substr(this.attrPrefixLen);
    } else {
      return false;
    }
  };
  var isCDATA = function(name) {
    return name === this.options.cdataTagName;
  };
  var buildOptions = require_util().buildOptions;
  var defaultOptions = {
    attributeNamePrefix: "@_",
    attrNodeName: false,
    textNodeName: "#text",
    ignoreAttributes: true,
    cdataTagName: false,
    cdataPositionChar: "\\c",
    format: false,
    indentBy: "  ",
    supressEmptyNode: false,
    tagValueProcessor: function(a) {
      return a;
    },
    attrValueProcessor: function(a) {
      return a;
    }
  };
  var props = [
    "attributeNamePrefix",
    "attrNodeName",
    "textNodeName",
    "ignoreAttributes",
    "cdataTagName",
    "cdataPositionChar",
    "format",
    "indentBy",
    "supressEmptyNode",
    "tagValueProcessor",
    "attrValueProcessor",
    "rootNodeName"
  ];
  Parser.prototype.parse = function(jObj) {
    if (Array.isArray(jObj) && this.options.rootNodeName && this.options.rootNodeName.length > 1) {
      jObj = {
        [this.options.rootNodeName]: jObj
      };
    }
    return this.j2x(jObj, 0).val;
  };
  Parser.prototype.j2x = function(jObj, level) {
    let attrStr = "";
    let val = "";
    for (let key in jObj) {
      if (typeof jObj[key] === "undefined") {
      } else if (jObj[key] === null) {
        val += this.indentate(level) + "<" + key + "/" + this.tagEndChar;
      } else if (jObj[key] instanceof Date) {
        val += this.buildTextNode(jObj[key], key, "", level);
      } else if (typeof jObj[key] !== "object") {
        const attr = this.isAttribute(key);
        if (attr) {
          attrStr += " " + attr + '="' + this.options.attrValueProcessor("" + jObj[key]) + '"';
        } else if (this.isCDATA(key)) {
          if (jObj[this.options.textNodeName]) {
            val += this.replaceCDATAstr(jObj[this.options.textNodeName], jObj[key]);
          } else {
            val += this.replaceCDATAstr("", jObj[key]);
          }
        } else {
          if (key === this.options.textNodeName) {
            if (jObj[this.options.cdataTagName]) {
            } else {
              val += this.options.tagValueProcessor("" + jObj[key]);
            }
          } else {
            val += this.buildTextNode(jObj[key], key, "", level);
          }
        }
      } else if (Array.isArray(jObj[key])) {
        if (this.isCDATA(key)) {
          val += this.indentate(level);
          if (jObj[this.options.textNodeName]) {
            val += this.replaceCDATAarr(jObj[this.options.textNodeName], jObj[key]);
          } else {
            val += this.replaceCDATAarr("", jObj[key]);
          }
        } else {
          const arrLen = jObj[key].length;
          for (let j = 0;j < arrLen; j++) {
            const item = jObj[key][j];
            if (typeof item === "undefined") {
            } else if (item === null) {
              val += this.indentate(level) + "<" + key + "/" + this.tagEndChar;
            } else if (typeof item === "object") {
              val += this.processTextOrObjNode(item, key, level);
            } else {
              val += this.buildTextNode(item, key, "", level);
            }
          }
        }
      } else {
        if (this.options.attrNodeName && key === this.options.attrNodeName) {
          const Ks = Object.keys(jObj[key]);
          const L = Ks.length;
          for (let j = 0;j < L; j++) {
            attrStr += " " + Ks[j] + '="' + this.options.attrValueProcessor("" + jObj[key][Ks[j]]) + '"';
          }
        } else {
          val += this.processTextOrObjNode(jObj[key], key, level);
        }
      }
    }
    return { attrStr, val };
  };
  module.exports = Parser;
});

// node_modules/fast-xml-parser/src/parser.js
var require_parser = __commonJS((exports) => {
  var nodeToJson = require_node2json();
  var xmlToNodeobj = require_xmlstr2xmlnode();
  var x2xmlnode = require_xmlstr2xmlnode();
  var buildOptions = require_util().buildOptions;
  var validator = require_validator();
  exports.parse = function(xmlData, givenOptions = {}, validationOption) {
    if (validationOption) {
      if (validationOption === true)
        validationOption = {};
      const result = validator.validate(xmlData, validationOption);
      if (result !== true) {
        throw Error(result.err.msg);
      }
    }
    if (givenOptions.parseTrueNumberOnly && givenOptions.parseNodeValue !== false && !givenOptions.numParseOptions) {
      givenOptions.numParseOptions = {
        leadingZeros: false
      };
    }
    let options = buildOptions(givenOptions, x2xmlnode.defaultOptions, x2xmlnode.props);
    const traversableObj = xmlToNodeobj.getTraversalObj(xmlData, options);
    return nodeToJson.convertToJson(traversableObj, options);
  };
  exports.convertTonimn = require_nimndata().convert2nimn;
  exports.getTraversalObj = xmlToNodeobj.getTraversalObj;
  exports.convertToJson = nodeToJson.convertToJson;
  exports.convertToJsonString = require_node2json_str().convertToJsonString;
  exports.validate = validator.validate;
  exports.j2xParser = require_json2xml();
  exports.parseToNimn = function(xmlData, schema, options) {
    return exports.convertTonimn(exports.getTraversalObj(xmlData, options), schema, options);
  };
});

// node_modules/@seancrowe/chiliconnector-base/index.js
var require_chiliconnector_base = __commonJS((exports) => {
  var __awaiter = function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve) {
        resolve(value);
      });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  var isConnectionGoodV1 = function(basePath, throwError) {
    return __awaiter(this, undefined, undefined, function* () {
      const chiliFetch = new ChiliFetch(basePath);
      try {
        const responseDate = yield chiliFetch.fetch(`/rest-api/v1/system/server/date`, { method: "GET" });
        if (responseDate.ok && (yield responseDate.readAsString()).includes("date")) {
          const responseKey = yield chiliFetch.fetch(`/rest-api/v1/system/apikey?environmentNameOrURL=testConnector_${Date.now()}`, { method: "GET" });
          return (yield responseKey.readAsString()).includes("Invalid Environment");
        }
      } catch (e) {
        if (throwError) {
          throw e;
        }
      }
      return false;
    });
  };
  Object.defineProperty(exports, "__esModule", { value: true });
  var crossFetch = require_browser_ponyfill();
  var fastXmlParser = require_parser();
  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation.
  
  Permission to use, copy, modify, and/or distribute this software for any
  purpose with or without fee is hereby granted.
  
  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
  PERFORMANCE OF THIS SOFTWARE.
  ***************************************************************************** */

  class ChiliResponse {
    constructor(response) {
      this._response = response;
      this._isNode = typeof process !== "undefined" && process.versions != null && process.versions.node != null;
    }
    get ok() {
      return this._response.ok;
    }
    get headers() {
      return this._response.headers;
    }
    get redirected() {
      return this._response.redirected;
    }
    get status() {
      return this._response.status;
    }
    get statusText() {
      return this._response.statusText;
    }
    get type() {
      return this._response.type;
    }
    get url() {
      return this._response.url;
    }
    clone() {
      return new ChiliResponse(this._response.clone());
    }
    get streamUsed() {
      return this._response.bodyUsed;
    }
    readAsNodeStream() {
      if (!this._isNode) {
        return null;
      } else {
        return this._response.body;
      }
    }
    readAsBrowserStream() {
      if (this._isNode) {
        return null;
      }
      return this._response.body;
    }
    readAsStream() {
      if (!this._isNode) {
        return this._response.body;
      } else {
        return this._response.body;
      }
    }
    get body() {
      return this.readAsStream();
    }
    readAsArrayBuffer() {
      return __awaiter(this, undefined, undefined, function* () {
        return this._response.arrayBuffer();
      });
    }
    arrayBuffer() {
      return __awaiter(this, undefined, undefined, function* () {
        return this.readAsArrayBuffer();
      });
    }
    readAsBlob() {
      return __awaiter(this, undefined, undefined, function* () {
        return this._response.blob();
      });
    }
    blob() {
      return __awaiter(this, undefined, undefined, function* () {
        return this.readAsBlob();
      });
    }
    readAsString() {
      return __awaiter(this, undefined, undefined, function* () {
        return this._response.text();
      });
    }
    text() {
      return __awaiter(this, undefined, undefined, function* () {
        return this.readAsString();
      });
    }
    readAsJson() {
      return __awaiter(this, undefined, undefined, function* () {
        return ChiliResponse._jsonifyResponse(yield this._response.text());
      });
    }
    json() {
      return __awaiter(this, undefined, undefined, function* () {
        return this.readAsJson();
      });
    }
    static _jsonifyResponse(response) {
      let data = fastXmlParser.parse(response, {
        ignoreAttributes: false,
        attrNodeName: false,
        attributeNamePrefix: ""
      });
      const firstKeys = Object.keys(data);
      if (firstKeys.length == 1) {
        if (typeof data[firstKeys[0]] == "object") {
          data = data[firstKeys[0]];
        }
      }
      return data;
    }
  }

  class ChiliFetch {
    constructor(basePath, baseRequestSettings) {
      var _a, _b, _c;
      this._basePath = basePath;
      this._defaultHeaders = (_a = baseRequestSettings === null || baseRequestSettings === undefined ? undefined : baseRequestSettings.headers) !== null && _a !== undefined ? _a : new crossFetch.Headers;
      this._defaultTimeout = (_b = baseRequestSettings === null || baseRequestSettings === undefined ? undefined : baseRequestSettings.timeout) !== null && _b !== undefined ? _b : 0;
      this._defaultMode = (_c = baseRequestSettings === null || baseRequestSettings === undefined ? undefined : baseRequestSettings.mode) !== null && _c !== undefined ? _c : "cors";
      let foundContentType = false;
      for (const [key] of this._defaultHeaders.entries()) {
        if (key.toLowerCase() === "content-type") {
          foundContentType = true;
        }
      }
      if (!foundContentType) {
        this._defaultHeaders.set("Content-Type", "application/json");
      }
    }
    set apiKey(apikey) {
      for (const [key] of this._defaultHeaders.entries()) {
        if (key.toLowerCase() == "api-key") {
          this._defaultHeaders.delete(key);
        }
      }
      if (apikey != null) {
        this._defaultHeaders.set("api-key", apikey);
      }
    }
    get apiKey() {
      return this._defaultHeaders.get("api-key");
    }
    static _encode(val) {
      return encodeURIComponent(val).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]");
    }
    fetch(path, chiliRequestConfig) {
      var _a, _b, _c, _d, _e, _f;
      return __awaiter(this, undefined, undefined, function* () {
        let timeoutHandler = null;
        const timeoutTime = (_b = (_a = chiliRequestConfig === null || chiliRequestConfig === undefined ? undefined : chiliRequestConfig.timeout) !== null && _a !== undefined ? _a : this._defaultTimeout) !== null && _b !== undefined ? _b : 0;
        if (timeoutTime != null && timeoutTime > 1) {
          timeoutHandler = setTimeout(() => {
            throw new Error("Request timeout - request took longer than " + timeoutTime + "ms to respond");
          }, timeoutTime);
        }
        const method = (_c = chiliRequestConfig === null || chiliRequestConfig === undefined ? undefined : chiliRequestConfig.method) !== null && _c !== undefined ? _c : "GET";
        const mode = (_e = (_d = chiliRequestConfig === null || chiliRequestConfig === undefined ? undefined : chiliRequestConfig.mode) !== null && _d !== undefined ? _d : this._defaultMode) !== null && _e !== undefined ? _e : "cors";
        const parameters = [];
        if ((chiliRequestConfig === null || chiliRequestConfig === undefined ? undefined : chiliRequestConfig.parameters) != null) {
          for (const [key, value] of Object.entries(chiliRequestConfig.parameters)) {
            if (value == null) {
              continue;
            }
            parameters.push(ChiliFetch._encode(key) + "=" + ChiliFetch._encode(value));
          }
        }
        const fullPath = this._basePath + path + (path.indexOf("?") === -1 ? "?" : "&") + parameters.join("&");
        let body = method != "GET" && method != "HEAD" ? (_f = chiliRequestConfig === null || chiliRequestConfig === undefined ? undefined : chiliRequestConfig.body) !== null && _f !== undefined ? _f : undefined : undefined;
        if (body != null) {
          if (typeof body == "object") {
            body = JSON.stringify(body);
          }
        }
        const response = yield crossFetch.fetch(fullPath, {
          method,
          mode,
          headers: this._defaultHeaders,
          body
        });
        if (timeoutHandler != null) {
          clearTimeout(timeoutHandler);
        }
        return new ChiliResponse(response);
      });
    }
  }

  class ChiliConnector {
    constructor(basePath, baseRequestSettings) {
      this._basePath = basePath;
      this._chiliFetch = new ChiliFetch(basePath, baseRequestSettings);
    }
    set apiKey(apiKey) {
      this._chiliFetch.apiKey = apiKey;
    }
    get apiKey() {
      return this._chiliFetch.apiKey;
    }
  }
  var types = Object.freeze({
    __proto__: null
  });
  exports.ChiliConnector = ChiliConnector;
  exports.ChiliFetch = ChiliFetch;
  exports.ChiliResponse = ChiliResponse;
  exports.ChiliTypes = types;
  exports.isConnectionGoodV1 = isConnectionGoodV1;
});

// node_modules/@seancrowe/chiliconnector-v1_2/index.js
var require_chiliconnector_v1_2 = __commonJS((exports) => {
  var __awaiter = function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve) {
        resolve(value);
      });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  Object.defineProperty(exports, "__esModule", { value: true });
  var chiliconnectorBase = require_chiliconnector_base();
  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation.
  
  Permission to use, copy, modify, and/or distribute this software for any
  purpose with or without fee is hereby granted.
  
  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
  PERFORMANCE OF THIS SOFTWARE.
  ***************************************************************************** */

  class ChiliRestInterfaceV1 {
    constructor(chiliFetch) {
      this._version = "1.2";
      this._chiliFetch = chiliFetch;
    }
    fetch(path, chiliRequestConfig) {
      return this._chiliFetch.fetch(path, chiliRequestConfig);
    }
    downloadTempFile(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        if (methodParameters.path != null) {
          queryData["path"] = methodParameters.path.toString();
        }
        if (methodParameters.data != null) {
          queryData["data"] = methodParameters.data.toString();
        }
        if (methodParameters.dynamicAssetProviderID != null) {
          queryData["dynamicAssetProviderID"] = methodParameters.dynamicAssetProviderID.toString();
        }
        if (methodParameters.noContentHeader != null) {
          queryData["noContentHeader"] = methodParameters.noContentHeader.toString();
        }
        const bodyData = null;
        const chiliRequestConfig = {
          method: "GET",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/${methodParameters.assetType}/download/tempfile`, chiliRequestConfig);
      });
    }
    resourceFolderMove(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        queryData["folderPath"] = methodParameters.folderPath.toString();
        queryData["newFolderPath"] = methodParameters.newFolderPath.toString();
        const bodyData = null;
        const chiliRequestConfig = {
          method: "PUT",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/${methodParameters.resourceName}/folders/move`, chiliRequestConfig);
      });
    }
    resourceItemGetByIdOrPath(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        queryData["itemIdOrPath"] = methodParameters.itemIdOrPath.toString();
        const bodyData = null;
        const chiliRequestConfig = {
          method: "GET",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/${methodParameters.resourceName}/items`, chiliRequestConfig);
      });
    }
    resourceItemAdd(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        queryData["newName"] = methodParameters.newName.toString();
        if (methodParameters.folderPath != null) {
          queryData["folderPath"] = methodParameters.folderPath.toString();
        }
        const bodyData = {};
        bodyData["xml"] = methodParameters.xml.toString();
        bodyData["fileData"] = methodParameters.fileData.toString();
        const chiliRequestConfig = {
          method: "POST",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/${methodParameters.resourceName}/items`, chiliRequestConfig);
      });
    }
    resourceItemsAddFromZip(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        queryData["folderPath"] = methodParameters.folderPath.toString();
        const bodyData = {};
        bodyData["fileData"] = methodParameters.fileData.toString();
        const chiliRequestConfig = {
          method: "POST",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/${methodParameters.resourceName}/items/fromzip`, chiliRequestConfig);
      });
    }
    resourceSearchPaged(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        if (methodParameters.name != null) {
          queryData["name"] = methodParameters.name.toString();
        }
        if (methodParameters.pageSize != null) {
          queryData["pageSize"] = methodParameters.pageSize.toString();
        }
        if (methodParameters.pageNum != null) {
          queryData["pageNum"] = methodParameters.pageNum.toString();
        }
        const bodyData = null;
        const chiliRequestConfig = {
          method: "GET",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/${methodParameters.resourceName}/paged`, chiliRequestConfig);
      });
    }
    resourceItemGetTransformedURL(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        queryData["type"] = methodParameters.type.toString();
        if (methodParameters.transformationID != null) {
          queryData["transformationID"] = methodParameters.transformationID.toString();
        }
        if (methodParameters.pageNum != null) {
          queryData["pageNum"] = methodParameters.pageNum.toString();
        }
        const bodyData = null;
        const chiliRequestConfig = {
          method: "GET",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/${methodParameters.resourceName}/items/${methodParameters.itemID}/transformedurl`, chiliRequestConfig);
      });
    }
    resourceItemGetTransformedURLWithDebugInfo(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        queryData["type"] = methodParameters.type.toString();
        if (methodParameters.transformationID != null) {
          queryData["transformationID"] = methodParameters.transformationID.toString();
        }
        if (methodParameters.pageNum != null) {
          queryData["pageNum"] = methodParameters.pageNum.toString();
        }
        const bodyData = null;
        const chiliRequestConfig = {
          method: "GET",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/${methodParameters.resourceName}/items/${methodParameters.itemID}/transformedurldebug`, chiliRequestConfig);
      });
    }
    resourceGetTreeLevel(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        if (methodParameters.parentFolder != null) {
          queryData["parentFolder"] = methodParameters.parentFolder.toString();
        }
        if (methodParameters.numLevels != null) {
          queryData["numLevels"] = methodParameters.numLevels.toString();
        }
        const bodyData = null;
        const chiliRequestConfig = {
          method: "GET",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/${methodParameters.resourceName}/treelevel`, chiliRequestConfig);
      });
    }
    resourceItemAddFromURLWithModificationDate(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        queryData["newName"] = methodParameters.newName.toString();
        queryData["folderPath"] = methodParameters.folderPath.toString();
        queryData["url"] = methodParameters.url.toString();
        if (methodParameters.login != null) {
          queryData["login"] = methodParameters.login.toString();
        }
        if (methodParameters.pw != null) {
          queryData["pw"] = methodParameters.pw.toString();
        }
        if (methodParameters.reuseExisting != null) {
          queryData["reuseExisting"] = methodParameters.reuseExisting.toString();
        }
        if (methodParameters.previewFileURL != null) {
          queryData["previewFileURL"] = methodParameters.previewFileURL.toString();
        }
        if (methodParameters.previewExtension != null) {
          queryData["previewExtension"] = methodParameters.previewExtension.toString();
        }
        if (methodParameters.isPermanentPreview != null) {
          queryData["isPermanentPreview"] = methodParameters.isPermanentPreview.toString();
        }
        if (methodParameters.modificationDate != null) {
          queryData["modificationDate"] = methodParameters.modificationDate.toString();
        }
        const bodyData = {};
        bodyData["fileInfoXmlElementContent"] = methodParameters.fileInfoXmlElementContent.toString();
        const chiliRequestConfig = {
          method: "POST",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/${methodParameters.resourceName}/items/fromurlmod`, chiliRequestConfig);
      });
    }
    resourceFolderCopy(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        queryData["folderPath"] = methodParameters.folderPath.toString();
        queryData["newFolderPath"] = methodParameters.newFolderPath.toString();
        queryData["includeSubFolders"] = methodParameters.includeSubFolders.toString();
        const bodyData = null;
        const chiliRequestConfig = {
          method: "POST",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/${methodParameters.resourceName}/folders/copy`, chiliRequestConfig);
      });
    }
    resourceItemGetCustomMetaData(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        queryData["setName"] = methodParameters.setName.toString();
        const bodyData = null;
        const chiliRequestConfig = {
          method: "GET",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/${methodParameters.resourceName}/items/${methodParameters.id}/metadata`, chiliRequestConfig);
      });
    }
    resourceItemSaveCustomMetaData(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        queryData["setName"] = methodParameters.setName.toString();
        const bodyData = {};
        bodyData["xml"] = methodParameters.xml.toString();
        const chiliRequestConfig = {
          method: "PUT",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/${methodParameters.resourceName}/items/${methodParameters.id}/metadata`, chiliRequestConfig);
      });
    }
    setNextResourceItemID(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        queryData["itemID"] = methodParameters.itemID.toString();
        const bodyData = null;
        const chiliRequestConfig = {
          method: "POST",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/${methodParameters.resourceName}/nextitemid`, chiliRequestConfig);
      });
    }
    resourceSearchPagedWithSorting(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        if (methodParameters.parentFolderPath != null) {
          queryData["parentFolderPath"] = methodParameters.parentFolderPath.toString();
        }
        if (methodParameters.includeSubDirectories != null) {
          queryData["includeSubDirectories"] = methodParameters.includeSubDirectories.toString();
        }
        if (methodParameters.name != null) {
          queryData["name"] = methodParameters.name.toString();
        }
        if (methodParameters.pageSize != null) {
          queryData["pageSize"] = methodParameters.pageSize.toString();
        }
        if (methodParameters.pageNum != null) {
          queryData["pageNum"] = methodParameters.pageNum.toString();
        }
        if (methodParameters.sortOn != null) {
          queryData["sortOn"] = methodParameters.sortOn.toString();
        }
        if (methodParameters.sortOrder != null) {
          queryData["sortOrder"] = methodParameters.sortOrder.toString();
        }
        if (methodParameters.itemID != null) {
          queryData["itemID"] = methodParameters.itemID.toString();
        }
        const bodyData = null;
        const chiliRequestConfig = {
          method: "GET",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/${methodParameters.resourceName}/sorted`, chiliRequestConfig);
      });
    }
    resourceSearch(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        if (methodParameters.name != null) {
          queryData["name"] = methodParameters.name.toString();
        }
        const bodyData = null;
        const chiliRequestConfig = {
          method: "GET",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/${methodParameters.resourceName}`, chiliRequestConfig);
      });
    }
    resourceGetTree(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        if (methodParameters.parentFolder != null) {
          queryData["parentFolder"] = methodParameters.parentFolder.toString();
        }
        if (methodParameters.includeSubDirectories != null) {
          queryData["includeSubDirectories"] = methodParameters.includeSubDirectories.toString();
        }
        if (methodParameters.includeFiles != null) {
          queryData["includeFiles"] = methodParameters.includeFiles.toString();
        }
        const bodyData = null;
        const chiliRequestConfig = {
          method: "GET",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/${methodParameters.resourceName}/tree`, chiliRequestConfig);
      });
    }
    resourceItemAddFromURL(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        queryData["newName"] = methodParameters.newName.toString();
        queryData["folderPath"] = methodParameters.folderPath.toString();
        queryData["url"] = methodParameters.url.toString();
        if (methodParameters.login != null) {
          queryData["login"] = methodParameters.login.toString();
        }
        if (methodParameters.pw != null) {
          queryData["pw"] = methodParameters.pw.toString();
        }
        if (methodParameters.reuseExisting != null) {
          queryData["reuseExisting"] = methodParameters.reuseExisting.toString();
        }
        if (methodParameters.previewFileURL != null) {
          queryData["previewFileURL"] = methodParameters.previewFileURL.toString();
        }
        if (methodParameters.previewExtension != null) {
          queryData["previewExtension"] = methodParameters.previewExtension.toString();
        }
        if (methodParameters.isPermanentPreview != null) {
          queryData["isPermanentPreview"] = methodParameters.isPermanentPreview.toString();
        }
        const bodyData = null;
        const chiliRequestConfig = {
          method: "POST",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/${methodParameters.resourceName}/items/fromurl`, chiliRequestConfig);
      });
    }
    resourceItemAddPreviewOverride(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        if (methodParameters.previewExtension != null) {
          queryData["previewExtension"] = methodParameters.previewExtension.toString();
        }
        if (methodParameters.isPermanentPreview != null) {
          queryData["isPermanentPreview"] = methodParameters.isPermanentPreview.toString();
        }
        const bodyData = {};
        bodyData["previewFileData"] = methodParameters.previewFileData.toString();
        const chiliRequestConfig = {
          method: "PUT",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/${methodParameters.resourceName}/items/${methodParameters.itemID}/previews`, chiliRequestConfig);
      });
    }
    resourceItemResetPreviews(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        const bodyData = null;
        const chiliRequestConfig = {
          method: "DELETE",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/${methodParameters.resourceName}/items/${methodParameters.itemID}/previews`, chiliRequestConfig);
      });
    }
    resourceItemCopy(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        queryData["newName"] = methodParameters.newName.toString();
        if (methodParameters.folderPath != null) {
          queryData["folderPath"] = methodParameters.folderPath.toString();
        }
        const bodyData = null;
        const chiliRequestConfig = {
          method: "POST",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/${methodParameters.resourceName}/items/${methodParameters.itemID}/copy`, chiliRequestConfig);
      });
    }
    resourceItemRemovePreviewOverride(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        const bodyData = null;
        const chiliRequestConfig = {
          method: "DELETE",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/${methodParameters.resourceName}/items/${methodParameters.itemID}/previewoverride`, chiliRequestConfig);
      });
    }
    resourceItemAddWithPreview(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        queryData["newName"] = methodParameters.newName.toString();
        queryData["folderPath"] = methodParameters.folderPath.toString();
        if (methodParameters.previewExtension != null) {
          queryData["previewExtension"] = methodParameters.previewExtension.toString();
        }
        if (methodParameters.isPermanentPreview != null) {
          queryData["isPermanentPreview"] = methodParameters.isPermanentPreview.toString();
        }
        const bodyData = {};
        bodyData["xml"] = methodParameters.xml.toString();
        bodyData["fileData"] = methodParameters.fileData.toString();
        bodyData["previewFileData"] = methodParameters.previewFileData.toString();
        const chiliRequestConfig = {
          method: "POST",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/${methodParameters.resourceName}/items/preview`, chiliRequestConfig);
      });
    }
    resourceItemGetURLForAnonymousUser(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        queryData["type"] = methodParameters.type.toString();
        if (methodParameters.pageNum != null) {
          queryData["pageNum"] = methodParameters.pageNum.toString();
        }
        const bodyData = null;
        const chiliRequestConfig = {
          method: "GET",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/${methodParameters.resourceName}/items/${methodParameters.itemID}/anonymousurl`, chiliRequestConfig);
      });
    }
    resourceItemGetURL(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        queryData["type"] = methodParameters.type.toString();
        if (methodParameters.pageNum != null) {
          queryData["pageNum"] = methodParameters.pageNum.toString();
        }
        const bodyData = null;
        const chiliRequestConfig = {
          method: "GET",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/${methodParameters.resourceName}/items/${methodParameters.itemID}/url`, chiliRequestConfig);
      });
    }
    resourceItemGetDefinitionXML(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        const bodyData = null;
        const chiliRequestConfig = {
          method: "GET",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/${methodParameters.resourceName}/items/${methodParameters.itemID}/definitionxml`, chiliRequestConfig);
      });
    }
    resourceItemGetXML(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        const bodyData = null;
        const chiliRequestConfig = {
          method: "GET",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/${methodParameters.resourceName}/items/${methodParameters.itemID}/xml`, chiliRequestConfig);
      });
    }
    resourceItemGetHistory(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        const bodyData = null;
        const chiliRequestConfig = {
          method: "GET",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/${methodParameters.resourceName}/items/${methodParameters.itemID}/history`, chiliRequestConfig);
      });
    }
    resourceItemGetCacheInfo(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        const bodyData = null;
        const chiliRequestConfig = {
          method: "GET",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/${methodParameters.resourceName}/items/${methodParameters.itemID}/cacheinfo`, chiliRequestConfig);
      });
    }
    resourceGetHistory(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        const bodyData = null;
        const chiliRequestConfig = {
          method: "GET",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/${methodParameters.resourceName}/history`, chiliRequestConfig);
      });
    }
    resourceLibraryGetSettings(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        queryData["libraryName"] = methodParameters.libraryName.toString();
        const bodyData = null;
        const chiliRequestConfig = {
          method: "GET",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/${methodParameters.resourceName}/folders/settings`, chiliRequestConfig);
      });
    }
    resourceLibrarySaveSettings(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        queryData["folderName"] = methodParameters.folderName.toString();
        const bodyData = {};
        bodyData["xml"] = methodParameters.xml.toString();
        const chiliRequestConfig = {
          method: "PUT",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/${methodParameters.resourceName}/folders/settings`, chiliRequestConfig);
      });
    }
    resourceFolderAdd(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        queryData["newName"] = methodParameters.newName.toString();
        if (methodParameters.parentPath != null) {
          queryData["parentPath"] = methodParameters.parentPath.toString();
        }
        const bodyData = null;
        const chiliRequestConfig = {
          method: "POST",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/${methodParameters.resourceName}/folders`, chiliRequestConfig);
      });
    }
    resourceFolderDelete(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        queryData["relativePath"] = methodParameters.relativePath.toString();
        const bodyData = null;
        const chiliRequestConfig = {
          method: "DELETE",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/${methodParameters.resourceName}/folders`, chiliRequestConfig);
      });
    }
    resourceItemDelete(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        const bodyData = null;
        const chiliRequestConfig = {
          method: "DELETE",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/${methodParameters.resourceName}/items/${methodParameters.itemID}`, chiliRequestConfig);
      });
    }
    resourceItemGetByName(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        queryData["itemName"] = methodParameters.itemName.toString();
        const bodyData = null;
        const chiliRequestConfig = {
          method: "GET",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/${methodParameters.resourceName}/items/byname`, chiliRequestConfig);
      });
    }
    resourceItemGetByPath(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        queryData["itemPath"] = methodParameters.itemPath.toString();
        const bodyData = null;
        const chiliRequestConfig = {
          method: "GET",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/${methodParameters.resourceName}/items/bypath`, chiliRequestConfig);
      });
    }
    resourceItemSave(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        const bodyData = {};
        bodyData["xml"] = methodParameters.xml.toString();
        const chiliRequestConfig = {
          method: "PUT",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/${methodParameters.resourceName}/items/${methodParameters.itemID}/save`, chiliRequestConfig);
      });
    }
    resourceSearchInFolder(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        queryData["parentFolderPath"] = methodParameters.parentFolderPath.toString();
        if (methodParameters.includeSubDirectories != null) {
          queryData["includeSubDirectories"] = methodParameters.includeSubDirectories.toString();
        }
        if (methodParameters.name != null) {
          queryData["name"] = methodParameters.name.toString();
        }
        const bodyData = null;
        const chiliRequestConfig = {
          method: "GET",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/${methodParameters.resourceName}/infolder`, chiliRequestConfig);
      });
    }
    resourceItemMove(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        queryData["newName"] = methodParameters.newName.toString();
        queryData["newFolderPath"] = methodParameters.newFolderPath.toString();
        const bodyData = null;
        const chiliRequestConfig = {
          method: "PUT",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/${methodParameters.resourceName}/items/${methodParameters.itemID}/move`, chiliRequestConfig);
      });
    }
    resourceItemReplaceFileWithPreviewOverride(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        if (methodParameters.previewExtension != null) {
          queryData["previewExtension"] = methodParameters.previewExtension.toString();
        }
        if (methodParameters.isPermanentPreview != null) {
          queryData["isPermanentPreview"] = methodParameters.isPermanentPreview.toString();
        }
        const bodyData = {};
        bodyData["fileData"] = methodParameters.fileData.toString();
        bodyData["previewFileData"] = methodParameters.previewFileData.toString();
        const chiliRequestConfig = {
          method: "PUT",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/${methodParameters.resourceName}/items/${methodParameters.itemID}/filewithpreview`, chiliRequestConfig);
      });
    }
    resourceItemReplaceFile(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        const bodyData = {};
        bodyData["fileData"] = methodParameters.fileData.toString();
        const chiliRequestConfig = {
          method: "PUT",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/${methodParameters.resourceName}/items/${methodParameters.itemID}/file`, chiliRequestConfig);
      });
    }
    resourceItemGetPrivateInfo(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        const bodyData = null;
        const chiliRequestConfig = {
          method: "GET",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/${methodParameters.resourceName}/items/${methodParameters.itemID}/privateinfo`, chiliRequestConfig);
      });
    }
    resourceSearchByIDs(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        if (methodParameters.IDs != null) {
          queryData["IDs"] = methodParameters.IDs.toString();
        }
        const bodyData = null;
        const chiliRequestConfig = {
          method: "GET",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/${methodParameters.resourceName}/byid`, chiliRequestConfig);
      });
    }
    resourceItemGetURLWithDebugInfo(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        queryData["type"] = methodParameters.type.toString();
        if (methodParameters.pageNum != null) {
          queryData["pageNum"] = methodParameters.pageNum.toString();
        }
        const bodyData = null;
        const chiliRequestConfig = {
          method: "GET",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/${methodParameters.resourceName}/items/${methodParameters.itemID}/debugurl`, chiliRequestConfig);
      });
    }
    downloadAssets(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        if (methodParameters.id != null) {
          queryData["id"] = methodParameters.id.toString();
        }
        if (methodParameters.path != null) {
          queryData["path"] = methodParameters.path.toString();
        }
        if (methodParameters.name != null) {
          queryData["name"] = methodParameters.name.toString();
        }
        if (methodParameters.type != null) {
          queryData["type"] = methodParameters.type.toString();
        }
        if (methodParameters.page != null) {
          queryData["page"] = methodParameters.page.toString();
        }
        if (methodParameters.client_app != null) {
          queryData["client_app"] = methodParameters.client_app.toString();
        }
        if (methodParameters.colorType != null) {
          queryData["colorType"] = methodParameters.colorType.toString();
        }
        if (methodParameters.noContentHeader != null) {
          queryData["noContentHeader"] = methodParameters.noContentHeader.toString();
        }
        if (methodParameters.taskId != null) {
          queryData["taskId"] = methodParameters.taskId.toString();
        }
        if (methodParameters.docId != null) {
          queryData["docId"] = methodParameters.docId.toString();
        }
        if (methodParameters.scale != null) {
          queryData["scale"] = methodParameters.scale.toString();
        }
        if (methodParameters.ipadItemPath != null) {
          queryData["ipadItemPath"] = methodParameters.ipadItemPath.toString();
        }
        if (methodParameters.transformationID != null) {
          queryData["transformationID"] = methodParameters.transformationID.toString();
        }
        if (methodParameters.transformationName != null) {
          queryData["transformationName"] = methodParameters.transformationName.toString();
        }
        if (methodParameters.async != null) {
          queryData["async"] = methodParameters.async.toString();
        }
        if (methodParameters.taskPriority != null) {
          queryData["taskPriority"] = methodParameters.taskPriority.toString();
        }
        const bodyData = null;
        const chiliRequestConfig = {
          method: "GET",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/${methodParameters.resourceType}/download`, chiliRequestConfig);
      });
    }
    threeDModelCreatePackage(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        const bodyData = null;
        const chiliRequestConfig = {
          method: "GET",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/3dmodels/${methodParameters.threeDModelId}/package`, chiliRequestConfig);
      });
    }
    generateApiKeyWithSettings(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        queryData["environmentNameOrURL"] = methodParameters.environmentNameOrURL.toString();
        const bodyData = {};
        bodyData["userName"] = methodParameters.userName.toString();
        bodyData["password"] = methodParameters.password.toString();
        bodyData["settingsXML"] = methodParameters.settingsXML.toString();
        const chiliRequestConfig = {
          method: "POST",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/system/apikey/withsetting`, chiliRequestConfig);
      });
    }
    apiKeyGetCurrentSettings(requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        const bodyData = null;
        const chiliRequestConfig = {
          method: "GET",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/system/apikey/withsettings`, chiliRequestConfig);
      });
    }
    setAutomaticPreviewGeneration(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        if (methodParameters.createPreviews != null) {
          queryData["createPreviews"] = methodParameters.createPreviews.toString();
        }
        const bodyData = null;
        const chiliRequestConfig = {
          method: "PUT",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/system/apikey/autopreviewgeneration`, chiliRequestConfig);
      });
    }
    setContentAdministration(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        if (methodParameters.allowContentAdministration != null) {
          queryData["allowContentAdministration"] = methodParameters.allowContentAdministration.toString();
        }
        const bodyData = null;
        const chiliRequestConfig = {
          method: "PUT",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/system/apikey/contentadministration`, chiliRequestConfig);
      });
    }
    lockApiKey(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        const bodyData = null;
        const chiliRequestConfig = {
          method: "PUT",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/system/apikey/lock/${methodParameters.apiKeyToLock}`, chiliRequestConfig);
      });
    }
    apiKeySetRequestWithCredentialsForDomain(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        queryData["domain"] = methodParameters.domain.toString();
        queryData["requestWithCredentials"] = methodParameters.requestWithCredentials.toString();
        const bodyData = null;
        const chiliRequestConfig = {
          method: "PUT",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/system/apikey/requestheaderswithcred`, chiliRequestConfig);
      });
    }
    apiKeySetRequestHeaderForDomain(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        queryData["headerFieldKey"] = methodParameters.headerFieldKey.toString();
        queryData["headerFieldValue"] = methodParameters.headerFieldValue.toString();
        if (methodParameters.domain != null) {
          queryData["domain"] = methodParameters.domain.toString();
        }
        const bodyData = null;
        const chiliRequestConfig = {
          method: "PUT",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/system/apikey/requestheaders`, chiliRequestConfig);
      });
    }
    generateApiKey(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        queryData["environmentNameOrURL"] = methodParameters.environmentNameOrURL.toString();
        const bodyData = {};
        bodyData["userName"] = methodParameters.userName.toString();
        bodyData["password"] = methodParameters.password.toString();
        const chiliRequestConfig = {
          method: "POST",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/system/apikey`, chiliRequestConfig);
      });
    }
    setWorkingEnvironment(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        queryData["environmentName"] = methodParameters.environmentName.toString();
        const bodyData = null;
        const chiliRequestConfig = {
          method: "PUT",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/system/apikey/workingenvironment`, chiliRequestConfig);
      });
    }
    setWorkspaceAdministration(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        if (methodParameters.allowWorkspaceAdministration != null) {
          queryData["allowWorkspaceAdministration"] = methodParameters.allowWorkspaceAdministration.toString();
        }
        const bodyData = null;
        const chiliRequestConfig = {
          method: "PUT",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/system/apikey/workspaceadministration`, chiliRequestConfig);
      });
    }
    setUserLanguage(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        queryData["languageIdOrName"] = methodParameters.languageIdOrName.toString();
        if (methodParameters.ignoreWorkSpaceLanguage != null) {
          queryData["ignoreWorkSpaceLanguage"] = methodParameters.ignoreWorkSpaceLanguage.toString();
        }
        const bodyData = null;
        const chiliRequestConfig = {
          method: "PUT",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/system/apikey/userlanguage`, chiliRequestConfig);
      });
    }
    setAssetDirectories(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        if (methodParameters.userAssetDirectory != null) {
          queryData["userAssetDirectory"] = methodParameters.userAssetDirectory.toString();
        }
        if (methodParameters.userGroupAssetDirectory != null) {
          queryData["userGroupAssetDirectory"] = methodParameters.userGroupAssetDirectory.toString();
        }
        if (methodParameters.documentAssetDirectory != null) {
          queryData["documentAssetDirectory"] = methodParameters.documentAssetDirectory.toString();
        }
        const bodyData = null;
        const chiliRequestConfig = {
          method: "PUT",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/system/apikey/assetdirectories`, chiliRequestConfig);
      });
    }
    apiKeySetHeaderFieldForServerDownloads(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        queryData["headerFieldKey"] = methodParameters.headerFieldKey.toString();
        queryData["headerFieldValue"] = methodParameters.headerFieldValue.toString();
        const bodyData = null;
        const chiliRequestConfig = {
          method: "PUT",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/system/apikey/headerfields`, chiliRequestConfig);
      });
    }
    apiKeyClearHeaderFieldsForServerDownloads(requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        const bodyData = null;
        const chiliRequestConfig = {
          method: "DELETE",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/system/apikey/headerfields`, chiliRequestConfig);
      });
    }
    apiKeyKeepAlive(requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        const bodyData = null;
        const chiliRequestConfig = {
          method: "PUT",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/system/apikey/keepalive`, chiliRequestConfig);
      });
    }
    apiKeyVerify(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        const bodyData = {};
        bodyData["apiKey"] = methodParameters.apiKey.toString();
        const chiliRequestConfig = {
          method: "PUT",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/system/apikey/verify`, chiliRequestConfig);
      });
    }
    uploadExternalAsset(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        queryData["url"] = methodParameters.url.toString();
        queryData["fileName"] = methodParameters.fileName.toString();
        const bodyData = {};
        bodyData["fileData"] = methodParameters.fileData.toString();
        const chiliRequestConfig = {
          method: "POST",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/assets/external`, chiliRequestConfig);
      });
    }
    assetGetImageInfo(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        const bodyData = null;
        const chiliRequestConfig = {
          method: "GET",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/assets/${methodParameters.assetID}/imageinfo`, chiliRequestConfig);
      });
    }
    assetGetSubjectInfo(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        const bodyData = null;
        const chiliRequestConfig = {
          method: "GET",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/assets/${methodParameters.assetID}/subjectinfo`, chiliRequestConfig);
      });
    }
    assetAddOrUpdateSubjectInfo(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        const bodyData = {};
        bodyData["asaX"] = methodParameters.asaX.toString();
        bodyData["asaY"] = methodParameters.asaY.toString();
        bodyData["asaWidth"] = methodParameters.asaWidth.toString();
        bodyData["asaHeight"] = methodParameters.asaHeight.toString();
        bodyData["poiX"] = methodParameters.poiX.toString();
        bodyData["poiY"] = methodParameters.poiY.toString();
        const chiliRequestConfig = {
          method: "POST",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/assets/${methodParameters.assetID}/subjectinfo`, chiliRequestConfig);
      });
    }
    assetDeleteSubjectInfo(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        const bodyData = null;
        const chiliRequestConfig = {
          method: "DELETE",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/assets/${methodParameters.assetID}/subjectinfo`, chiliRequestConfig);
      });
    }
    barcodeCreate(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        queryData["barcodeTypeID"] = methodParameters.barcodeTypeID.toString();
        queryData["barcodeText"] = methodParameters.barcodeText.toString();
        const bodyData = null;
        const chiliRequestConfig = {
          method: "POST",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/settings/barcodes`, chiliRequestConfig);
      });
    }
    barcodeCreateColored(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        queryData["barcodeTypeID"] = methodParameters.barcodeTypeID.toString();
        queryData["barcodeText"] = methodParameters.barcodeText.toString();
        if (methodParameters.backColor != null) {
          queryData["backColor"] = methodParameters.backColor.toString();
        }
        if (methodParameters.barColor != null) {
          queryData["barColor"] = methodParameters.barColor.toString();
        }
        if (methodParameters.textColor != null) {
          queryData["textColor"] = methodParameters.textColor.toString();
        }
        const bodyData = null;
        const chiliRequestConfig = {
          method: "POST",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/settings/barcodescolored`, chiliRequestConfig);
      });
    }
    downloadBarcode(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        if (methodParameters.type != null) {
          queryData["type"] = methodParameters.type.toString();
        }
        if (methodParameters.id != null) {
          queryData["id"] = methodParameters.id.toString();
        }
        if (methodParameters.name != null) {
          queryData["name"] = methodParameters.name.toString();
        }
        if (methodParameters.text != null) {
          queryData["text"] = methodParameters.text.toString();
        }
        if (methodParameters.backCol != null) {
          queryData["backCol"] = methodParameters.backCol.toString();
        }
        if (methodParameters.barCol != null) {
          queryData["barCol"] = methodParameters.barCol.toString();
        }
        if (methodParameters.textCol != null) {
          queryData["textCol"] = methodParameters.textCol.toString();
        }
        const bodyData = null;
        const chiliRequestConfig = {
          method: "GET",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/BarcodeTypes/download`, chiliRequestConfig);
      });
    }
    spellingCheck(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        const bodyData = {};
        bodyData["text"] = methodParameters.text.toString();
        bodyData["configurationFlags"] = methodParameters.configurationFlags.toString();
        const chiliRequestConfig = {
          method: "POST",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/spelling/check/${methodParameters.language}`, chiliRequestConfig);
      });
    }
    dataSourceDownloadSpreadsheets(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        const bodyData = null;
        const chiliRequestConfig = {
          method: "GET",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/settings/datasources/${methodParameters.dataSourceID}/spreadsheets`, chiliRequestConfig);
      });
    }
    dataSourceSpreadsheetGetXML(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        const bodyData = {};
        bodyData["spreadsheetID"] = methodParameters.spreadsheetID.toString();
        const chiliRequestConfig = {
          method: "POST",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/settings/datasources/${methodParameters.dataSourceID}/spreadsheets/${methodParameters.spreadsheetID}`, chiliRequestConfig);
      });
    }
    dataSourceSalesForceGetXML(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        const bodyData = null;
        const chiliRequestConfig = {
          method: "GET",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/settings/datasources/${methodParameters.dataSourceID}/salesforce`, chiliRequestConfig);
      });
    }
    dataSourceFileGetXML(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        if (methodParameters.fileExtension != null) {
          queryData["fileExtension"] = methodParameters.fileExtension.toString();
        }
        const bodyData = {};
        bodyData["fileDataOrPath"] = methodParameters.fileDataOrPath.toString();
        const chiliRequestConfig = {
          method: "PUT",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/settings/datasources/${methodParameters.dataSourceID}/xmlconverter`, chiliRequestConfig);
      });
    }
    dataSourceDownloadURL(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        queryData["urlType"] = methodParameters.urlType.toString();
        if (methodParameters.query != null) {
          queryData["query"] = methodParameters.query.toString();
        }
        if (methodParameters.forDocumentID != null) {
          queryData["forDocumentID"] = methodParameters.forDocumentID.toString();
        }
        if (methodParameters.editorQueryString != null) {
          queryData["editorQueryString"] = methodParameters.editorQueryString.toString();
        }
        const bodyData = null;
        const chiliRequestConfig = {
          method: "GET",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/settings/datasources/${methodParameters.dataSourceID}/downloadurl`, chiliRequestConfig);
      });
    }
    dataSourceListSampleFiles(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        const bodyData = null;
        const chiliRequestConfig = {
          method: "GET",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/settings/datasources/${methodParameters.dataSourceID}/samplefiles`, chiliRequestConfig);
      });
    }
    dataSourceAddSampleFile(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        queryData["fileName"] = methodParameters.fileName.toString();
        const bodyData = {};
        bodyData["fileOrData"] = methodParameters.fileOrData.toString();
        const chiliRequestConfig = {
          method: "POST",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/settings/datasources/${methodParameters.dataSourceID}/files`, chiliRequestConfig);
      });
    }
    dataSourceDeleteSampleFile(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        const bodyData = null;
        const chiliRequestConfig = {
          method: "DELETE",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/settings/datasources/${methodParameters.dataSourceID}/samplefiles/${methodParameters.fileName}`, chiliRequestConfig);
      });
    }
    downloadDatasourceSample(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        if (methodParameters.name != null) {
          queryData["name"] = methodParameters.name.toString();
        }
        if (methodParameters.id != null) {
          queryData["id"] = methodParameters.id.toString();
        }
        const bodyData = null;
        const chiliRequestConfig = {
          method: "GET",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/DatasourceSample/download`, chiliRequestConfig);
      });
    }
    documentCreatePackage(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        if (methodParameters.taskPriority != null) {
          queryData["taskPriority"] = methodParameters.taskPriority.toString();
        }
        const bodyData = null;
        const chiliRequestConfig = {
          method: "POST",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/documents/${methodParameters.itemID}/representations/package`, chiliRequestConfig);
      });
    }
    documentCreateTempPackage(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        if (methodParameters.itemID != null) {
          queryData["itemID"] = methodParameters.itemID.toString();
        }
        if (methodParameters.taskPriority != null) {
          queryData["taskPriority"] = methodParameters.taskPriority.toString();
        }
        const bodyData = {};
        bodyData["docXML"] = methodParameters.docXML.toString();
        const chiliRequestConfig = {
          method: "POST",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/documents/tempxml/package`, chiliRequestConfig);
      });
    }
    documentCopyDocumentEventActions(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        queryData["fromItemID"] = methodParameters.fromItemID.toString();
        if (methodParameters.replaceExistingActions != null) {
          queryData["replaceExistingActions"] = methodParameters.replaceExistingActions.toString();
        }
        const bodyData = null;
        const chiliRequestConfig = {
          method: "PUT",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/documents/${methodParameters.toItemID}/documenteventactions/copy`, chiliRequestConfig);
      });
    }
    documentGetDocumentEventActions(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        const bodyData = null;
        const chiliRequestConfig = {
          method: "GET",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/documents/${methodParameters.itemID}/eventactions`, chiliRequestConfig);
      });
    }
    documentSetDocumentEventActions(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        if (methodParameters.replaceExistingActions != null) {
          queryData["replaceExistingActions"] = methodParameters.replaceExistingActions.toString();
        }
        const bodyData = {};
        bodyData["definitionXML"] = methodParameters.definitionXML.toString();
        const chiliRequestConfig = {
          method: "POST",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/documents/${methodParameters.itemID}/eventactions`, chiliRequestConfig);
      });
    }
    documentCreateTempFolding(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        queryData["itemID"] = methodParameters.itemID.toString();
        if (methodParameters.taskPriority != null) {
          queryData["taskPriority"] = methodParameters.taskPriority.toString();
        }
        const bodyData = {};
        bodyData["docXML"] = methodParameters.docXML.toString();
        const chiliRequestConfig = {
          method: "POST",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/documents/tempxml/folding`, chiliRequestConfig);
      });
    }
    documentGetFoldingViewerURL(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        if (methodParameters.foldingSettingsID != null) {
          queryData["foldingSettingsID"] = methodParameters.foldingSettingsID.toString();
        }
        const bodyData = {};
        bodyData["modXML"] = methodParameters.modXML.toString();
        const chiliRequestConfig = {
          method: "POST",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/documents/${methodParameters.itemID}/urls/foldingviewer`, chiliRequestConfig);
      });
    }
    documentCreateImagesAndPDF(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        queryData["imageConversionProfileID"] = methodParameters.imageConversionProfileID.toString();
        if (methodParameters.taskPriority != null) {
          queryData["taskPriority"] = methodParameters.taskPriority.toString();
        }
        const bodyData = {};
        bodyData["settingsXML"] = methodParameters.settingsXML.toString();
        const chiliRequestConfig = {
          method: "POST",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/documents/${methodParameters.itemID}/representations/imagesandpdf`, chiliRequestConfig);
      });
    }
    documentCreateTempImagesAndPDF(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        queryData["imageConversionProfileID"] = methodParameters.imageConversionProfileID.toString();
        if (methodParameters.itemID != null) {
          queryData["itemID"] = methodParameters.itemID.toString();
        }
        if (methodParameters.taskPriority != null) {
          queryData["taskPriority"] = methodParameters.taskPriority.toString();
        }
        const bodyData = {};
        bodyData["settingsXML"] = methodParameters.settingsXML.toString();
        bodyData["docXML"] = methodParameters.docXML.toString();
        const chiliRequestConfig = {
          method: "POST",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/documents/tempxml/imagesandpdf`, chiliRequestConfig);
      });
    }
    documentSetDataSource(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        const bodyData = {};
        bodyData["datasourceXML"] = methodParameters.datasourceXML.toString();
        const chiliRequestConfig = {
          method: "POST",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/documents/${methodParameters.itemID}/datasource`, chiliRequestConfig);
      });
    }
    documentCreateFromODT(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        queryData["documentName"] = methodParameters.documentName.toString();
        queryData["folderPath"] = methodParameters.folderPath.toString();
        const bodyData = {};
        bodyData["odtPathOrData"] = methodParameters.odtPathOrData.toString();
        bodyData["settingsXML"] = methodParameters.settingsXML.toString();
        const chiliRequestConfig = {
          method: "POST",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/documents/fromodt`, chiliRequestConfig);
      });
    }
    documentGetThreeDModelViewerURL(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        if (methodParameters.threeDModelID != null) {
          queryData["threeDModelID"] = methodParameters.threeDModelID.toString();
        }
        const bodyData = {};
        bodyData["modXML"] = methodParameters.modXML.toString();
        const chiliRequestConfig = {
          method: "POST",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/documents/${methodParameters.itemID}/urls/threedmodelviewer`, chiliRequestConfig);
      });
    }
    documentGetHTMLEditorURL(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        if (methodParameters.workSpaceID != null) {
          queryData["workSpaceID"] = methodParameters.workSpaceID.toString();
        }
        if (methodParameters.viewPrefsID != null) {
          queryData["viewPrefsID"] = methodParameters.viewPrefsID.toString();
        }
        if (methodParameters.constraintsID != null) {
          queryData["constraintsID"] = methodParameters.constraintsID.toString();
        }
        if (methodParameters.viewerOnly != null) {
          queryData["viewerOnly"] = methodParameters.viewerOnly.toString();
        }
        if (methodParameters.forAnonymousUser != null) {
          queryData["forAnonymousUser"] = methodParameters.forAnonymousUser.toString();
        }
        const bodyData = null;
        const chiliRequestConfig = {
          method: "GET",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/documents/${methodParameters.itemID}/urls/editor`, chiliRequestConfig);
      });
    }
    documentGetHTMLPreloadURL(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        if (methodParameters.workSpaceID != null) {
          queryData["workSpaceID"] = methodParameters.workSpaceID.toString();
        }
        if (methodParameters.viewPrefsID != null) {
          queryData["viewPrefsID"] = methodParameters.viewPrefsID.toString();
        }
        if (methodParameters.constraintsID != null) {
          queryData["constraintsID"] = methodParameters.constraintsID.toString();
        }
        const bodyData = null;
        const chiliRequestConfig = {
          method: "GET",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/documents/${methodParameters.itemID}/urls/htmlpreload`, chiliRequestConfig);
      });
    }
    documentGetHTMLFoldingViewerURL(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        if (methodParameters.foldingSettingsID != null) {
          queryData["foldingSettingsID"] = methodParameters.foldingSettingsID.toString();
        }
        const bodyData = {};
        bodyData["modXML"] = methodParameters.modXML.toString();
        const chiliRequestConfig = {
          method: "POST",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/documents/${methodParameters.itemID}/urls/htmlfoldingviewer`, chiliRequestConfig);
      });
    }
    documentGetHTMLPreload(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        if (methodParameters.workSpaceID != null) {
          queryData["workSpaceID"] = methodParameters.workSpaceID.toString();
        }
        if (methodParameters.viewPrefsID != null) {
          queryData["viewPrefsID"] = methodParameters.viewPrefsID.toString();
        }
        if (methodParameters.constraintsID != null) {
          queryData["constraintsID"] = methodParameters.constraintsID.toString();
        }
        const bodyData = null;
        const chiliRequestConfig = {
          method: "GET",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/documents/${methodParameters.itemID}/htmlpreload`, chiliRequestConfig);
      });
    }
    documentGetHTMLThreeDModelViewerURL(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        if (methodParameters.threeDModelID != null) {
          queryData["threeDModelID"] = methodParameters.threeDModelID.toString();
        }
        const bodyData = {};
        bodyData["modXML"] = methodParameters.modXML.toString();
        const chiliRequestConfig = {
          method: "POST",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/documents/${methodParameters.itemID}/urls/htmlthreedmodelviewer`, chiliRequestConfig);
      });
    }
    documentProcessServerSide(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        const bodyData = {};
        bodyData["itemID"] = methodParameters.itemID.toString();
        bodyData["resourceXML"] = methodParameters.resourceXML.toString();
        const chiliRequestConfig = {
          method: "PUT",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/documents/documentprocessor`, chiliRequestConfig);
      });
    }
    documentCreateFromChiliPackage(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        queryData["documentName"] = methodParameters.documentName.toString();
        queryData["folderPath"] = methodParameters.folderPath.toString();
        if (methodParameters.newAssetLocation != null) {
          queryData["newAssetLocation"] = methodParameters.newAssetLocation.toString();
        }
        if (methodParameters.newFontLocation != null) {
          queryData["newFontLocation"] = methodParameters.newFontLocation.toString();
        }
        const bodyData = {};
        bodyData["packagePathOrData"] = methodParameters.packagePathOrData.toString();
        const chiliRequestConfig = {
          method: "POST",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/documents/frompackage`, chiliRequestConfig);
      });
    }
    documentCreateFromBlankDocTemplate(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        queryData["documentName"] = methodParameters.documentName.toString();
        queryData["folderPath"] = methodParameters.folderPath.toString();
        queryData["blankDocTemplateID"] = methodParameters.blankDocTemplateID.toString();
        const bodyData = null;
        const chiliRequestConfig = {
          method: "POST",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/documents/fromtemplate`, chiliRequestConfig);
      });
    }
    documentGetVariableDefinitions(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        const bodyData = null;
        const chiliRequestConfig = {
          method: "GET",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/documents/${methodParameters.itemID}/variabledefinitions`, chiliRequestConfig);
      });
    }
    documentSetVariableDefinitions(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        if (methodParameters.replaceExistingVariables != null) {
          queryData["replaceExistingVariables"] = methodParameters.replaceExistingVariables.toString();
        }
        const bodyData = {};
        bodyData["definitionXML"] = methodParameters.definitionXML.toString();
        const chiliRequestConfig = {
          method: "POST",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/documents/${methodParameters.itemID}/variabledefinitions`, chiliRequestConfig);
      });
    }
    documentGetVariableValues(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        const bodyData = null;
        const chiliRequestConfig = {
          method: "GET",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/documents/${methodParameters.itemID}/variablevalues`, chiliRequestConfig);
      });
    }
    documentSetVariableValues(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        const bodyData = {};
        bodyData["varXML"] = methodParameters.varXML.toString();
        const chiliRequestConfig = {
          method: "POST",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/documents/${methodParameters.itemID}/variablevalues`, chiliRequestConfig);
      });
    }
    documentCopyVariableDefinitions(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        queryData["fromItemID"] = methodParameters.fromItemID.toString();
        if (methodParameters.replaceExistingVariables != null) {
          queryData["replaceExistingVariables"] = methodParameters.replaceExistingVariables.toString();
        }
        const bodyData = null;
        const chiliRequestConfig = {
          method: "PUT",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/documents/${methodParameters.toItemID}/variabledefinitions/copy`, chiliRequestConfig);
      });
    }
    documentGetInfo(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        if (methodParameters.extended != null) {
          queryData["extended"] = methodParameters.extended.toString();
        }
        const bodyData = null;
        const chiliRequestConfig = {
          method: "GET",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/documents/${methodParameters.itemID}/info`, chiliRequestConfig);
      });
    }
    documentCreateIDML(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        if (methodParameters.taskPriority != null) {
          queryData["taskPriority"] = methodParameters.taskPriority.toString();
        }
        const bodyData = {};
        bodyData["settingsXML"] = methodParameters.settingsXML.toString();
        const chiliRequestConfig = {
          method: "POST",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/documents/${methodParameters.itemID}/representations/idml`, chiliRequestConfig);
      });
    }
    documentGetPreflightResults(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        const bodyData = null;
        const chiliRequestConfig = {
          method: "GET",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/documents/${methodParameters.itemID}/preflightresults`, chiliRequestConfig);
      });
    }
    documentCreateHTML(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        if (methodParameters.taskPriority != null) {
          queryData["taskPriority"] = methodParameters.taskPriority.toString();
        }
        const bodyData = {};
        bodyData["settingsXML"] = methodParameters.settingsXML.toString();
        const chiliRequestConfig = {
          method: "POST",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/documents/${methodParameters.itemID}/representations/html`, chiliRequestConfig);
      });
    }
    documentCreateTempIDML(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        if (methodParameters.itemID != null) {
          queryData["itemID"] = methodParameters.itemID.toString();
        }
        if (methodParameters.taskPriority != null) {
          queryData["taskPriority"] = methodParameters.taskPriority.toString();
        }
        const bodyData = {};
        bodyData["docXML"] = methodParameters.docXML.toString();
        bodyData["settingsXML"] = methodParameters.settingsXML.toString();
        const chiliRequestConfig = {
          method: "POST",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/documents/tempxml/idml`, chiliRequestConfig);
      });
    }
    documentCreateODF(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        if (methodParameters.taskPriority != null) {
          queryData["taskPriority"] = methodParameters.taskPriority.toString();
        }
        const bodyData = {};
        bodyData["settingsXML"] = methodParameters.settingsXML.toString();
        const chiliRequestConfig = {
          method: "POST",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/documents/${methodParameters.itemID}/representations/odf`, chiliRequestConfig);
      });
    }
    documentCreateTempHTML(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        if (methodParameters.itemID != null) {
          queryData["itemID"] = methodParameters.itemID.toString();
        }
        if (methodParameters.taskPriority != null) {
          queryData["taskPriority"] = methodParameters.taskPriority.toString();
        }
        const bodyData = {};
        bodyData["docXML"] = methodParameters.docXML.toString();
        bodyData["settingsXML"] = methodParameters.settingsXML.toString();
        const chiliRequestConfig = {
          method: "POST",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/documents/tempxml/html`, chiliRequestConfig);
      });
    }
    documentGetUsedAssets(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        const bodyData = null;
        const chiliRequestConfig = {
          method: "GET",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/documents/${methodParameters.itemID}/usedassets`, chiliRequestConfig);
      });
    }
    documentCreateTempODF(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        if (methodParameters.itemID != null) {
          queryData["itemID"] = methodParameters.itemID.toString();
        }
        if (methodParameters.taskPriority != null) {
          queryData["taskPriority"] = methodParameters.taskPriority.toString();
        }
        const bodyData = {};
        bodyData["docXML"] = methodParameters.docXML.toString();
        bodyData["settingsXML"] = methodParameters.settingsXML.toString();
        const chiliRequestConfig = {
          method: "POST",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/documents/tempxml/odf`, chiliRequestConfig);
      });
    }
    documentGetAnnotations(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        const bodyData = null;
        const chiliRequestConfig = {
          method: "GET",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/documents/${methodParameters.itemID}/annotations`, chiliRequestConfig);
      });
    }
    documentSetAnnotations(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        if (methodParameters.replaceExistingAnnotations != null) {
          queryData["replaceExistingAnnotations"] = methodParameters.replaceExistingAnnotations.toString();
        }
        const bodyData = {};
        bodyData["annotationXML"] = methodParameters.annotationXML.toString();
        const chiliRequestConfig = {
          method: "POST",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/documents/${methodParameters.itemID}/annotations`, chiliRequestConfig);
      });
    }
    documentCopyAnnotations(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        queryData["fromItemID"] = methodParameters.fromItemID.toString();
        if (methodParameters.replaceExistingAnnotations != null) {
          queryData["replaceExistingAnnotations"] = methodParameters.replaceExistingAnnotations.toString();
        }
        const bodyData = null;
        const chiliRequestConfig = {
          method: "PUT",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/documents/${methodParameters.toItemID}/annotations/copy`, chiliRequestConfig);
      });
    }
    documentSetConstraints(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        queryData["constraintsID"] = methodParameters.constraintsID.toString();
        const bodyData = null;
        const chiliRequestConfig = {
          method: "POST",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/documents/${methodParameters.itemID}/constraints`, chiliRequestConfig);
      });
    }
    documentGetDefaultSettings(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        if (methodParameters.itemID != null) {
          queryData["itemID"] = methodParameters.itemID.toString();
        }
        if (methodParameters.viewType != null) {
          queryData["viewType"] = methodParameters.viewType.toString();
        }
        if (methodParameters.viewPrefsID != null) {
          queryData["viewPrefsID"] = methodParameters.viewPrefsID.toString();
        }
        if (methodParameters.constraintID != null) {
          queryData["constraintID"] = methodParameters.constraintID.toString();
        }
        const bodyData = null;
        const chiliRequestConfig = {
          method: "GET",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/documents/defaultsettings`, chiliRequestConfig);
      });
    }
    documentCreatePDF(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        if (methodParameters.taskPriority != null) {
          queryData["taskPriority"] = methodParameters.taskPriority.toString();
        }
        const bodyData = {};
        bodyData["settingsXML"] = methodParameters.settingsXML.toString();
        const chiliRequestConfig = {
          method: "POST",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/documents/${methodParameters.itemID}/representations/pdf`, chiliRequestConfig);
      });
    }
    documentCreateTempPDF(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        if (methodParameters.itemID != null) {
          queryData["itemID"] = methodParameters.itemID.toString();
        }
        if (methodParameters.taskPriority != null) {
          queryData["taskPriority"] = methodParameters.taskPriority.toString();
        }
        const bodyData = {};
        bodyData["settingsXML"] = methodParameters.settingsXML.toString();
        bodyData["docXML"] = methodParameters.docXML.toString();
        const chiliRequestConfig = {
          method: "POST",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/documents/tempxml/pdf`, chiliRequestConfig);
      });
    }
    documentSetAssetDirectories(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        if (methodParameters.userAssetDirectory != null) {
          queryData["userAssetDirectory"] = methodParameters.userAssetDirectory.toString();
        }
        if (methodParameters.userGroupAssetDirectory != null) {
          queryData["userGroupAssetDirectory"] = methodParameters.userGroupAssetDirectory.toString();
        }
        if (methodParameters.documentAssetDirectory != null) {
          queryData["documentAssetDirectory"] = methodParameters.documentAssetDirectory.toString();
        }
        const bodyData = null;
        const chiliRequestConfig = {
          method: "POST",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/documents/${methodParameters.documentID}/assetdirectories`, chiliRequestConfig);
      });
    }
    documentCreateFromPDF(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        queryData["documentName"] = methodParameters.documentName.toString();
        queryData["folderPath"] = methodParameters.folderPath.toString();
        queryData["backgroundAssetLocation"] = methodParameters.backgroundAssetLocation.toString();
        const bodyData = {};
        bodyData["pdfPathOrData"] = methodParameters.pdfPathOrData.toString();
        const chiliRequestConfig = {
          method: "POST",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/documents/frompdf`, chiliRequestConfig);
      });
    }
    documentCreateImages(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        queryData["imageConversionProfileID"] = methodParameters.imageConversionProfileID.toString();
        if (methodParameters.taskPriority != null) {
          queryData["taskPriority"] = methodParameters.taskPriority.toString();
        }
        const bodyData = {};
        bodyData["settingsXML"] = methodParameters.settingsXML.toString();
        const chiliRequestConfig = {
          method: "POST",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/documents/${methodParameters.itemID}/representations/images`, chiliRequestConfig);
      });
    }
    documentCreateTempImages(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        queryData["imageConversionProfileID"] = methodParameters.imageConversionProfileID.toString();
        if (methodParameters.itemID != null) {
          queryData["itemID"] = methodParameters.itemID.toString();
        }
        if (methodParameters.taskPriority != null) {
          queryData["taskPriority"] = methodParameters.taskPriority.toString();
        }
        const bodyData = {};
        bodyData["settingsXML"] = methodParameters.settingsXML.toString();
        bodyData["docXML"] = methodParameters.docXML.toString();
        const chiliRequestConfig = {
          method: "POST",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/documents/tempxml/images`, chiliRequestConfig);
      });
    }
    dynamicAssetProviderGetTempAsset(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        const bodyData = {};
        bodyData["data"] = methodParameters.data.toString();
        const chiliRequestConfig = {
          method: "POST",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/settings/dynamicassetproviders/${methodParameters.dynamicAssetProviderID}/tempasset`, chiliRequestConfig);
      });
    }
    environmentGetReflectionMaps(requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        const bodyData = null;
        const chiliRequestConfig = {
          method: "GET",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/system/environments/reflectionmaps`, chiliRequestConfig);
      });
    }
    interfaceGetInitialSettings(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        if (methodParameters.forEditor != null) {
          queryData["forEditor"] = methodParameters.forEditor.toString();
        }
        const bodyData = null;
        const chiliRequestConfig = {
          method: "GET",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/system/environments/interfaceinitialsettings`, chiliRequestConfig);
      });
    }
    environmentList(requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        const bodyData = null;
        const chiliRequestConfig = {
          method: "GET",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/system/environments`, chiliRequestConfig);
      });
    }
    environmentAdd(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        queryData["newName"] = methodParameters.newName.toString();
        const bodyData = null;
        const chiliRequestConfig = {
          method: "POST",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/system/environments`, chiliRequestConfig);
      });
    }
    environmentGetCurrent(requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        const bodyData = null;
        const chiliRequestConfig = {
          method: "GET",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/system/environments/current`, chiliRequestConfig);
      });
    }
    environmentSaveSettings(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        const bodyData = {};
        bodyData["xml"] = methodParameters.xml.toString();
        const chiliRequestConfig = {
          method: "PUT",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/system/environments/${methodParameters.environmentName}`, chiliRequestConfig);
      });
    }
    environmentDelete(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        const bodyData = null;
        const chiliRequestConfig = {
          method: "DELETE",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/system/environments/${methodParameters.environmentName}`, chiliRequestConfig);
      });
    }
    environmentGetColorProfiles(requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        const bodyData = null;
        const chiliRequestConfig = {
          method: "GET",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/system/environments/colorprofiles`, chiliRequestConfig);
      });
    }
    environmentGetLoginSettings(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        const bodyData = null;
        const chiliRequestConfig = {
          method: "GET",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/system/environments/${methodParameters.environmentNameOrURL}/loginsettings`, chiliRequestConfig);
      });
    }
    environmentGetSettings(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        const bodyData = null;
        const chiliRequestConfig = {
          method: "GET",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/system/environments/${methodParameters.environmentName}/settings`, chiliRequestConfig);
      });
    }
    environmentCopy(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        queryData["newName"] = methodParameters.newName.toString();
        const bodyData = null;
        const chiliRequestConfig = {
          method: "POST",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/system/environments/${methodParameters.environmentName}/copy`, chiliRequestConfig);
      });
    }
    downloadExternal(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        if (methodParameters.path != null) {
          queryData["path"] = methodParameters.path.toString();
        }
        const bodyData = null;
        const chiliRequestConfig = {
          method: "GET",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/External/download`, chiliRequestConfig);
      });
    }
    downloadFolding(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        if (methodParameters.id != null) {
          queryData["id"] = methodParameters.id.toString();
        }
        if (methodParameters.type != null) {
          queryData["type"] = methodParameters.type.toString();
        }
        if (methodParameters.foldingId != null) {
          queryData["foldingId"] = methodParameters.foldingId.toString();
        }
        const bodyData = null;
        const chiliRequestConfig = {
          method: "GET",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/Folding/download`, chiliRequestConfig);
      });
    }
    foldingSettingCreatePackage(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        const bodyData = null;
        const chiliRequestConfig = {
          method: "GET",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/settings/foldingsettings/${methodParameters.foldingSettingId}/package`, chiliRequestConfig);
      });
    }
    getFontURL(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        const bodyData = null;
        const chiliRequestConfig = {
          method: "GET",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/system/font/${methodParameters.language}`, chiliRequestConfig);
      });
    }
    fontGetIncludedGlyphs(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        const bodyData = null;
        const chiliRequestConfig = {
          method: "GET",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/fonts/${methodParameters.fontID}/includedglyphs`, chiliRequestConfig);
      });
    }
    downloadFontPreview(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        queryData["type"] = methodParameters.type.toString();
        queryData["width"] = methodParameters.width.toString();
        queryData["height"] = methodParameters.height.toString();
        if (methodParameters.alphabet != null) {
          queryData["alphabet"] = methodParameters.alphabet.toString();
        }
        if (methodParameters.id != null) {
          queryData["id"] = methodParameters.id.toString();
        }
        if (methodParameters.name != null) {
          queryData["name"] = methodParameters.name.toString();
        }
        if (methodParameters.taskId != null) {
          queryData["taskId"] = methodParameters.taskId.toString();
        }
        if (methodParameters.taskPriority != null) {
          queryData["taskPriority"] = methodParameters.taskPriority.toString();
        }
        if (methodParameters.async != null) {
          queryData["async"] = methodParameters.async.toString();
        }
        const bodyData = null;
        const chiliRequestConfig = {
          method: "GET",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/Fonts/download`, chiliRequestConfig);
      });
    }
    downloadIcons(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        if (methodParameters.environment != null) {
          queryData["environment"] = methodParameters.environment.toString();
        }
        if (methodParameters.set != null) {
          queryData["set"] = methodParameters.set.toString();
        }
        if (methodParameters.icon != null) {
          queryData["icon"] = methodParameters.icon.toString();
        }
        if (methodParameters.preferSvg != null) {
          queryData["preferSvg"] = methodParameters.preferSvg.toString();
        }
        if (methodParameters.isCursor != null) {
          queryData["isCursor"] = methodParameters.isCursor.toString();
        }
        if (methodParameters.tempPath != null) {
          queryData["tempPath"] = methodParameters.tempPath.toString();
        }
        const bodyData = null;
        const chiliRequestConfig = {
          method: "GET",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/Icons/download`, chiliRequestConfig);
      });
    }
    spellingGetSupportedLanguages(requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        const bodyData = null;
        const chiliRequestConfig = {
          method: "GET",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/spelling/langs`, chiliRequestConfig);
      });
    }
    languageGetUnicodeTextURL(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        const bodyData = null;
        const chiliRequestConfig = {
          method: "GET",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/system/languages/${methodParameters.languageID}/urls/unicodetext`, chiliRequestConfig);
      });
    }
    languageImportUnicodeText(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        const bodyData = {};
        bodyData["filePathOrData"] = methodParameters.filePathOrData.toString();
        const chiliRequestConfig = {
          method: "POST",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/system/languages/${methodParameters.languageID}/unicodetext`, chiliRequestConfig);
      });
    }
    languageGetCombinedStrings(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        if (methodParameters.overrideBasedOn != null) {
          queryData["overrideBasedOn"] = methodParameters.overrideBasedOn.toString();
        }
        const bodyData = null;
        const chiliRequestConfig = {
          method: "GET",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/system/languages/${methodParameters.languageID}/combinedstrings`, chiliRequestConfig);
      });
    }
    languageSaveStrings(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        const bodyData = {};
        bodyData["stringXML"] = methodParameters.stringXML.toString();
        const chiliRequestConfig = {
          method: "PUT",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/system/languages/${methodParameters.languageID}`, chiliRequestConfig);
      });
    }
    languagesGetList(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        if (methodParameters.includeSystemLanguages != null) {
          queryData["includeSystemLanguages"] = methodParameters.includeSystemLanguages.toString();
        }
        const bodyData = null;
        const chiliRequestConfig = {
          method: "GET",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/system/languages`, chiliRequestConfig);
      });
    }
    languageGetCsvURL(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        const bodyData = null;
        const chiliRequestConfig = {
          method: "GET",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/system/languages/${methodParameters.languageID}/urls/csv`, chiliRequestConfig);
      });
    }
    languageImportCsv(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        const bodyData = {};
        bodyData["filePathOrData"] = methodParameters.filePathOrData.toString();
        const chiliRequestConfig = {
          method: "POST",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/system/languages/${methodParameters.languageID}/csv`, chiliRequestConfig);
      });
    }
    downloadLoginBackground(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        if (methodParameters.env != null) {
          queryData["env"] = methodParameters.env.toString();
        }
        if (methodParameters.type != null) {
          queryData["type"] = methodParameters.type.toString();
        }
        const bodyData = null;
        const chiliRequestConfig = {
          method: "GET",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/Login/download`, chiliRequestConfig);
      });
    }
    oDTGetStyles(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        const bodyData = {};
        bodyData["fileData"] = methodParameters.fileData.toString();
        const chiliRequestConfig = {
          method: "POST",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/settings/odt/styles`, chiliRequestConfig);
      });
    }
    oDTGetTextFlow(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        const bodyData = {};
        bodyData["fileData"] = methodParameters.fileData.toString();
        bodyData["stylesMapping"] = methodParameters.stylesMapping.toString();
        const chiliRequestConfig = {
          method: "POST",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/settings/odt/textflow`, chiliRequestConfig);
      });
    }
    downloadReflectionMap(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        if (methodParameters.name != null) {
          queryData["name"] = methodParameters.name.toString();
        }
        if (methodParameters.side != null) {
          queryData["side"] = methodParameters.side.toString();
        }
        const bodyData = null;
        const chiliRequestConfig = {
          method: "GET",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources/ReflectionMap/download`, chiliRequestConfig);
      });
    }
    resourceList(requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        const bodyData = null;
        const chiliRequestConfig = {
          method: "GET",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/resources`, chiliRequestConfig);
      });
    }
    serverGetLoggingSettings(requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        const bodyData = null;
        const chiliRequestConfig = {
          method: "GET",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/system/server/loggingsettings`, chiliRequestConfig);
      });
    }
    serverSaveLoggingSettings(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        const bodyData = {};
        bodyData["xml"] = methodParameters.xml.toString();
        const chiliRequestConfig = {
          method: "PUT",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/system/server/loggingsettings`, chiliRequestConfig);
      });
    }
    serverLogClear(requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        const bodyData = null;
        const chiliRequestConfig = {
          method: "DELETE",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/system/server/logs`, chiliRequestConfig);
      });
    }
    serverGetLicenseInfo(requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        const bodyData = null;
        const chiliRequestConfig = {
          method: "GET",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/system/server/licenseinfo`, chiliRequestConfig);
      });
    }
    serverLicenseRequest(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        queryData["remoteFunction"] = methodParameters.remoteFunction.toString();
        const bodyData = {};
        bodyData["argumentsXML"] = methodParameters.argumentsXML.toString();
        const chiliRequestConfig = {
          method: "POST",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/system/server/licenserequest`, chiliRequestConfig);
      });
    }
    googleCreateAuthorizationUrl(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        queryData["clientID"] = methodParameters.clientID.toString();
        queryData["clientSecret"] = methodParameters.clientSecret.toString();
        const bodyData = null;
        const chiliRequestConfig = {
          method: "GET",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/system/server/googleauthurl`, chiliRequestConfig);
      });
    }
    getServerDate(requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        const bodyData = null;
        const chiliRequestConfig = {
          method: "GET",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/system/server/date`, chiliRequestConfig);
      });
    }
    serverGetSettings(requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        const bodyData = null;
        const chiliRequestConfig = {
          method: "GET",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/system/server/settings`, chiliRequestConfig);
      });
    }
    serverSaveSettings(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        const bodyData = {};
        bodyData["xml"] = methodParameters.xml.toString();
        const chiliRequestConfig = {
          method: "PUT",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/system/server/settings`, chiliRequestConfig);
      });
    }
    spellingSuggest(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        const bodyData = {};
        bodyData["word"] = methodParameters.word.toString();
        bodyData["configurationFlags"] = methodParameters.configurationFlags.toString();
        const chiliRequestConfig = {
          method: "POST",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/spelling/suggest/${methodParameters.language}`, chiliRequestConfig);
      });
    }
    switchServerTestConnection(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        queryData["url"] = methodParameters.url.toString();
        queryData["userName"] = methodParameters.userName.toString();
        if (methodParameters.userPW != null) {
          queryData["userPW"] = methodParameters.userPW.toString();
        }
        if (methodParameters.oemKey != null) {
          queryData["oemKey"] = methodParameters.oemKey.toString();
        }
        const bodyData = null;
        const chiliRequestConfig = {
          method: "GET",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/settings/switchservers/testconnection`, chiliRequestConfig);
      });
    }
    switchServerGetFlowList(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        const bodyData = null;
        const chiliRequestConfig = {
          method: "GET",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/settings/switchservers/${methodParameters.switchServerID}/flows`, chiliRequestConfig);
      });
    }
    switchServerFlowGetSubmitPoints(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        const bodyData = null;
        const chiliRequestConfig = {
          method: "GET",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/settings/switchservers/${methodParameters.switchServerID}/flows/${methodParameters.flowID}/submitpoints`, chiliRequestConfig);
      });
    }
    switchServerFlowGetCheckPoints(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        const bodyData = null;
        const chiliRequestConfig = {
          method: "GET",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/settings/switchservers/${methodParameters.switchServerID}/flows/${methodParameters.flowID}/checkpoints`, chiliRequestConfig);
      });
    }
    switchServerFlowGetJobs(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        const bodyData = null;
        const chiliRequestConfig = {
          method: "GET",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/settings/switchservers/${methodParameters.switchServerID}/flows/${methodParameters.flowID}/jobs`, chiliRequestConfig);
      });
    }
    switchServerFlowGetFullConfig(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        const bodyData = null;
        const chiliRequestConfig = {
          method: "GET",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/settings/switchservers/${methodParameters.switchServerID}/flows/${methodParameters.flowID}/fullconfig`, chiliRequestConfig);
      });
    }
    switchServerFlowGetElementsJobCount(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        const bodyData = null;
        const chiliRequestConfig = {
          method: "GET",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/settings/switchservers/${methodParameters.switchServerID}/flows/${methodParameters.flowID}/elementsjobcount`, chiliRequestConfig);
      });
    }
    switchServerFlowSubmitFileToFolder(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        queryData["fileName"] = methodParameters.fileName.toString();
        const bodyData = {};
        bodyData["filePathOrData"] = methodParameters.filePathOrData.toString();
        const chiliRequestConfig = {
          method: "POST",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/settings/switchservers/${methodParameters.switchServerID}/flows/${methodParameters.flowID}/folder/${methodParameters.elementID}`, chiliRequestConfig);
      });
    }
    switchServerFlowSubmitFileToSubmitPoint(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        queryData["fileName"] = methodParameters.fileName.toString();
        const bodyData = {};
        bodyData["filePathOrData"] = methodParameters.filePathOrData.toString();
        bodyData["metaXML"] = methodParameters.metaXML.toString();
        const chiliRequestConfig = {
          method: "POST",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/settings/switchservers/${methodParameters.switchServerID}/flows/${methodParameters.flowID}/submitpoint/${methodParameters.elementID}`, chiliRequestConfig);
      });
    }
    taskGetEditorCliLog(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        const bodyData = null;
        const chiliRequestConfig = {
          method: "GET",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/system/tasks/${methodParameters.taskID}/editorclilog`, chiliRequestConfig);
      });
    }
    taskGetStatus(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        const bodyData = null;
        const chiliRequestConfig = {
          method: "GET",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/system/tasks/${methodParameters.taskID}/status`, chiliRequestConfig);
      });
    }
    taskGetStatusAndRemoveIfCompleted(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        const bodyData = null;
        const chiliRequestConfig = {
          method: "PUT",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/system/tasks/${methodParameters.taskID}/status`, chiliRequestConfig);
      });
    }
    taskRemoveFromLog(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        const bodyData = null;
        const chiliRequestConfig = {
          method: "DELETE",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/system/tasks/${methodParameters.taskID}`, chiliRequestConfig);
      });
    }
    tasksGetQueueOverview(requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        const bodyData = null;
        const chiliRequestConfig = {
          method: "GET",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/system/tasks/queue`, chiliRequestConfig);
      });
    }
    tasksGetList(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        if (methodParameters.includeRunningTasks != null) {
          queryData["includeRunningTasks"] = methodParameters.includeRunningTasks.toString();
        }
        if (methodParameters.includeWaitingTasks != null) {
          queryData["includeWaitingTasks"] = methodParameters.includeWaitingTasks.toString();
        }
        if (methodParameters.includeFinishedTasks != null) {
          queryData["includeFinishedTasks"] = methodParameters.includeFinishedTasks.toString();
        }
        const bodyData = null;
        const chiliRequestConfig = {
          method: "GET",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/system/tasks`, chiliRequestConfig);
      });
    }
    tasksGetStatusses(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        const bodyData = {};
        bodyData["taskXML"] = methodParameters.taskXML.toString();
        const chiliRequestConfig = {
          method: "GET",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/system/tasks/statuses`, chiliRequestConfig);
      });
    }
    downloadURL(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        queryData["url"] = methodParameters.url.toString();
        const bodyData = null;
        const chiliRequestConfig = {
          method: "GET",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/system/urldownload`, chiliRequestConfig);
      });
    }
    xinetExecutePortalDICall(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        if (methodParameters.arguments != null) {
          queryData["arguments"] = methodParameters.arguments.toString();
        }
        const bodyData = null;
        const chiliRequestConfig = {
          method: "PUT",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/settings/xinetservers/${methodParameters.xinetServerID}/calls/${methodParameters.callID}`, chiliRequestConfig);
      });
    }
    xinetSetCurrentCredentials(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        queryData["userName"] = methodParameters.userName.toString();
        queryData["userPW"] = methodParameters.userPW.toString();
        const bodyData = null;
        const chiliRequestConfig = {
          method: "PUT",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/settings/xinetservers/currentcredentials`, chiliRequestConfig);
      });
    }
    xinetTestConnection(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        queryData["url"] = methodParameters.url.toString();
        queryData["userName"] = methodParameters.userName.toString();
        queryData["userPW"] = methodParameters.userPW.toString();
        const bodyData = null;
        const chiliRequestConfig = {
          method: "GET",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/settings/xinetservers/testconnection`, chiliRequestConfig);
      });
    }
    csvFileCreate(methodParameters, requestOptions) {
      return __awaiter(this, undefined, undefined, function* () {
        const queryData = {};
        queryData["fileName"] = methodParameters.fileName.toString();
        const bodyData = {};
        bodyData["xmlData"] = methodParameters.xmlData.toString();
        const chiliRequestConfig = {
          method: "POST",
          body: bodyData,
          parameters: queryData
        };
        if (requestOptions != null && requestOptions.timeout != null) {
          chiliRequestConfig["timeout"] = requestOptions.timeout;
        }
        if (requestOptions != null && requestOptions.mode != null) {
          chiliRequestConfig["mode"] = requestOptions.mode;
        }
        return this.fetch(`/rest-api/v${this._version}/system/xmlcsvconverter`, chiliRequestConfig);
      });
    }
  }

  class ChiliConnectorV1_2 extends chiliconnectorBase.ChiliConnector {
    constructor(basePath, baseRequestSettings) {
      super(basePath, baseRequestSettings);
      this.api = new ChiliRestInterfaceV1(this._chiliFetch);
    }
    isConnectionGood(throwError = false) {
      return __awaiter(this, undefined, undefined, function* () {
        return chiliconnectorBase.isConnectionGoodV1(this._basePath, throwError);
      });
    }
  }
  exports.ChiliConnector = ChiliConnectorV1_2;
  exports.default = ChiliConnectorV1_2;
});

// index.ts
var publisher_interface = __toESM(require_PublisherInterface(), 1);
var chiliconnector_v1_2 = __toESM(require_chiliconnector_v1_2(), 1);
async function loadPublisher(editorUrl, baseUrl, docId, apiKey) {
  const app = document.getElementById("app") || document.createElement("div");
  app.id = "app";
  app.innerHTML = `
        <div style="text-align: center; margin-top: 20px;">
            PDF Export Settings ID:<input id="pdfExportSettings" title="PDF Export Settings">
            Image Conversion ID:<input id="imageConversionProfileId" title="Image Conversion Profile ID">
            <button id="save">Save</button>
            <button id="export">Export</button>
            <button id="exportHard">Export with Hardcoded PDF Setting</button>
            <div id="chili-editor"></div>
        </div>
    `;
  document.body.appendChild(app);
  const div = document.getElementById("chili-editor");
  const pi = await publisher_interface.PublisherInterface.buildOnElement(div, editorUrl, {});
  pi.iframe.style.width = "100%";
  pi.iframe.style.height = "800px";
  window.publisher = pi;
  const cc = new chiliconnector_v1_2.ChiliConnector(baseUrl);
  cc.apiKey = apiKey;
  document.getElementById("save")?.addEventListener("click", async (e) => {
    const xml = await pi.executeFunction("document", "GetTempXML");
    const resp = await cc.api.resourceItemSave({ resourceName: "Documents", xml, itemID: docId });
    if (resp.ok) {
      alert("Saved");
    } else {
      alert("Save failed");
    }
    console.log(await resp.text());
  });
  document.getElementById("export")?.addEventListener("click", async (e) => {
    const pdfId = document.getElementById("pdfExportSettings").value;
    const imageId = document.getElementById("imageConversionProfileId").value;
    generateImage({ docId, imageId, pdfId });
  });
  document.getElementById("exportHard")?.addEventListener("click", async (e) => {
    const imageId = document.getElementById("imageConversionProfileId").value;
    const pdfXml = '<item name="High Resolution" id="0305fc89-1956-45e5-8377-b0bc82fcc56f" relativePath="" pdfEngine="1" missingAdPlaceHolderColor="#FF00FF" missingAdPlaceHolder="False" missingEditPlaceHolder="False" includeLinks="False" includeGuides="False" includeTextRangeBorder="True" includePageMargins="True" includeFrameBorder="True" imageQuality="original" includeCropMarks="True" includeBleedMarks="False" includeImages="True" convertColors="False" colorProfile="" embedProfile="False" includeNonPrintingLayers="False" includeGrid="True" includeBleed="False" includeAdOverlays="False" includeSectionBreaks="False" includePageLabels="False" includeFrameInset="True" includeBaseLineGrid="True" includeSlug="False" includeAnnotations="False" outputSplitPages="1" layoutID="" createAllPages="True" pageRangeStart="1" userPassword="" ownerPassword="" pdfSubject="" pdfKeywords="" watermarkText="" pdfLayers="False" createSingleFile="True" createSpreads="False" serverOutputLocation="" pdfNamePattern="" slugLeft="" slugTop="" slugRight="" slugBottom="" bleedRight="3 mm" bleedTop="3 mm" bleedLeft="3 mm" useDocumentBleed="True" useDocumentSlug="True" optimizationOptions="" preflight_overrideDocumentSettings="False" preflight_minOutputResolution="72" preflight_minResizePercentage="70" preflight_maxResizePercentage="120" dataSourceIncludeBackgroundLayers="False" dataSourceCreateBackgroundPDF="False" dataSourceRowsPerPDF="100" dataSourceMaxRows="-1" dontDeleteExistingDirectory="False" collateOutputWidth="210mm" collateNumRows="10" collateNumCols="2" collateOutputHeight="297mm" collateColumnWidth="90 mm" collateStartX="10mm" collateStartY="10mm" collateMarginX="10mm" allowExtractContent="True" collateMarginY="10mm" collateOutput="False" collateDrawPageBorder="False" collateIncludeFileHeader="False" missingAdSizePlaceHolderColor="#FF00FF" rgbSwatches="False" dropshadowQuality="300" missingEditPlaceHolderColor="#FF00FF" annotationBorderColor="#FF0000" annotationFillColor="#FFFFFF" annotationOpacity="50" linkBorderColor="#0000FF" dropshadowTextQuality="300" bleedBottom="3 mm" barWidthReduction="0 mm" markOffset="2.5 mm" markWidth="0.15 mm" dataSourceEngine="server_code" dataSourceNumConcurrent="3" dataSourceUnspecifiedContentType="variable_data" dataSourceIncludeGenerationLog="False" dataSourceUnspecifiedPageContentType="variable_data" outputIntentRegistryName="http://www.color.org" outputIntentConditionIdentifier="FOGRA39" outputIntent="CoatedFOGRA39.icc" pdfStandard="PDF/X-4" pdfVersion="4" debugVtContent="False" watermarkType="none" watermarkPdfAssetID="" watermarkPdfAnchor="top_left" pageRangeEnd="999999" watermarkPdfSize="original" convertBlacks="False" convertAnyK100="True" convertSystemBlack="True" convert0_0_0_100="True" convertBlackToC="63" convertBlackToK="100" convertBlackToY="51" convertBlackToM="52" debugDropShadowsWithoutBlur="False" missingAdSizePlaceHolder="False" pdfCreator="CreationHub - Publisher" pdfAuthor="CreationHub" allowPrinting="True" allowModifyDocument="True" fastWebView="False" embedFonts="True" useFontSubset="True" exportDatasourceXlsx="False" exportDatasourceCsv="False" pdfTitle="{0}" dataSourceCreate="True" includeBookmarks="False" maxRecordsPerDatasourceFile="50000" minSuccessRate="100" errorHandling="error" removeInvisibleImageData="False" forPreview="False"><pdfvt_metaDataConfigItems /><color_images_settings downsampling="Off" targetResolution="0" resolutionThreshold="0" compression="RetainExisting" compressionQuality="" /><grayscale_images_settings downsampling="Off" targetResolution="0" resolutionThreshold="0" compression="RetainExisting" compressionQuality="" /><monochrome_images_settings downsampling="Off" targetResolution="0" resolutionThreshold="0" compression="RetainExisting" compressionQuality="" /></item>';
    generateImage({ pdfXml, imageId, docId });
  });
  async function generateImage({ pdfId, imageId, pdfXml, docId: docId2 }) {
    if (pdfId != null) {
      const pdfXmlResp = await cc.api.resourceItemGetXML({ itemID: pdfId, resourceName: "PdfExportSettings" });
      if (!pdfXmlResp.ok) {
        alert("PDF Export settings wrong");
        return;
      }
      pdfXml = await pdfXmlResp.text();
    }
    const taskXmlResp = await cc.api.documentCreateImages({ itemID: docId2, settingsXML: pdfXml, imageConversionProfileID: imageId });
    const taskJson = await taskXmlResp.json();
    let currentTask = taskJson;
    while (currentTask.finished == "False") {
      currentTask = await cc.api.taskGetStatus({ taskID: currentTask.id });
    }
    console.log(currentTask);
    alert("task done - see console");
  }
}
async function loadChili(url) {
  if (!url.includes("editor_html.aspx")) {
    alert("wrong URL");
    return false;
  }
  const urlObject = new URL(url);
  const doc = urlObject.searchParams.get("doc");
  const apiKey = urlObject.searchParams.get("apiKey");
  if (!doc || !apiKey) {
    alert("Missing parameters");
    return false;
  }
  const baseUrl = `${urlObject.protocol}//${urlObject.hostname}`;
  loadPublisher(url, baseUrl, doc, apiKey);
  return true;
}
document.addEventListener("DOMContentLoaded", () => {
  const app = document.createElement("div");
  app.innerHTML = `
        <div style="text-align: center; margin-top: 20px;">
            <h1 id="header">Give me a document URL</h1>
            <input type="text" id="documentUrl" placeholder="Enter URL here">
            <button id="addDocument">Add Document</button>
        </div>
    `;
  document.body.appendChild(app);
  const button = document.getElementById("addDocument");
  button.addEventListener("click", async () => {
    const input = document.getElementById("documentUrl");
    const success = await loadChili(input.value);
    if (success) {
      app.innerHTML = "";
    }
  });
});
