/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "./context/AuthContext.tsx":
/*!*********************************!*\
  !*** ./context/AuthContext.tsx ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   AuthProvider: () => (/* binding */ AuthProvider),\n/* harmony export */   useAuth: () => (/* binding */ useAuth)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n\n\nconst AuthContext = /*#__PURE__*/ (0,react__WEBPACK_IMPORTED_MODULE_1__.createContext)(undefined);\nfunction AuthProvider({ children }) {\n    // Always start with null to ensure server and client render the same\n    const [token, setToken] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);\n    const [user, setUser] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);\n    const [mounted, setMounted] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);\n    // Hydrate from localStorage after mount (client-side only)\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{\n        setMounted(true);\n        const storedToken = localStorage.getItem(\"token\");\n        const storedUser = localStorage.getItem(\"user\");\n        if (storedToken) setToken(storedToken);\n        if (storedUser) {\n            try {\n                setUser(JSON.parse(storedUser));\n            } catch (e) {\n            // Invalid JSON, ignore\n            }\n        }\n    }, []);\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{\n        if (!mounted) return;\n        function onStorage(e) {\n            if (e.key === \"token\") setToken(e.newValue);\n            if (e.key === \"user\") setUser(e.newValue ? JSON.parse(e.newValue) : null);\n        }\n        window.addEventListener(\"storage\", onStorage);\n        return ()=>window.removeEventListener(\"storage\", onStorage);\n    }, [\n        mounted\n    ]);\n    function login(t, u) {\n        setToken(t);\n        setUser(u);\n        if (false) {}\n    }\n    function logout() {\n        setToken(null);\n        setUser(null);\n        if (false) {}\n    }\n    const value = {\n        token,\n        user,\n        authenticated: !!token,\n        login,\n        logout\n    };\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(AuthContext.Provider, {\n        value: value,\n        children: children\n    }, void 0, false, {\n        fileName: \"/app/context/AuthContext.tsx\",\n        lineNumber: 81,\n        columnNumber: 12\n    }, this);\n}\nfunction useAuth() {\n    const ctx = (0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(AuthContext);\n    if (!ctx) throw new Error(\"useAuth must be used within AuthProvider\");\n    return ctx;\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9jb250ZXh0L0F1dGhDb250ZXh0LnRzeCIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQTZFO0FBa0I3RSxNQUFNSyw0QkFBY0osb0RBQWFBLENBQStCSztBQUV6RCxTQUFTQyxhQUFhLEVBQUVDLFFBQVEsRUFBaUM7SUFDcEUscUVBQXFFO0lBQ3JFLE1BQU0sQ0FBQ0MsT0FBT0MsU0FBUyxHQUFHTiwrQ0FBUUEsQ0FBZ0I7SUFDbEQsTUFBTSxDQUFDTyxNQUFNQyxRQUFRLEdBQUdSLCtDQUFRQSxDQUFjO0lBQzlDLE1BQU0sQ0FBQ1MsU0FBU0MsV0FBVyxHQUFHViwrQ0FBUUEsQ0FBQztJQUV2QywyREFBMkQ7SUFDM0RELGdEQUFTQSxDQUFDO1FBQ05XLFdBQVc7UUFDWCxNQUFNQyxjQUFjQyxhQUFhQyxPQUFPLENBQUM7UUFDekMsTUFBTUMsYUFBYUYsYUFBYUMsT0FBTyxDQUFDO1FBQ3hDLElBQUlGLGFBQWFMLFNBQVNLO1FBQzFCLElBQUlHLFlBQVk7WUFDWixJQUFJO2dCQUNBTixRQUFRTyxLQUFLQyxLQUFLLENBQUNGO1lBQ3ZCLEVBQUUsT0FBT0csR0FBRztZQUNSLHVCQUF1QjtZQUMzQjtRQUNKO0lBQ0osR0FBRyxFQUFFO0lBRUxsQixnREFBU0EsQ0FBQztRQUNOLElBQUksQ0FBQ1UsU0FBUztRQUVkLFNBQVNTLFVBQVVELENBQWU7WUFDOUIsSUFBSUEsRUFBRUUsR0FBRyxLQUFLLFNBQVNiLFNBQVNXLEVBQUVHLFFBQVE7WUFDMUMsSUFBSUgsRUFBRUUsR0FBRyxLQUFLLFFBQVFYLFFBQVFTLEVBQUVHLFFBQVEsR0FBR0wsS0FBS0MsS0FBSyxDQUFDQyxFQUFFRyxRQUFRLElBQUk7UUFDeEU7UUFFQUMsT0FBT0MsZ0JBQWdCLENBQUMsV0FBV0o7UUFDbkMsT0FBTyxJQUFNRyxPQUFPRSxtQkFBbUIsQ0FBQyxXQUFXTDtJQUN2RCxHQUFHO1FBQUNUO0tBQVE7SUFFWixTQUFTZSxNQUFNQyxDQUFTLEVBQUVDLENBQWM7UUFDcENwQixTQUFTbUI7UUFDVGpCLFFBQVFrQjtRQUNSLElBQUksS0FBa0IsRUFBYSxFQUlsQztJQUNMO0lBRUEsU0FBU0k7UUFDTHhCLFNBQVM7UUFDVEUsUUFBUTtRQUNSLElBQUksS0FBa0IsRUFBYSxFQUdsQztJQUNMO0lBRUEsTUFBTXVCLFFBQTBCO1FBQzVCMUI7UUFDQUU7UUFDQXlCLGVBQWUsQ0FBQyxDQUFDM0I7UUFDakJtQjtRQUNBTTtJQUNKO0lBRUEscUJBQU8sOERBQUM3QixZQUFZZ0MsUUFBUTtRQUFDRixPQUFPQTtrQkFBUTNCOzs7Ozs7QUFDaEQ7QUFFTyxTQUFTOEI7SUFDWixNQUFNQyxNQUFNckMsaURBQVVBLENBQUNHO0lBQ3ZCLElBQUksQ0FBQ2tDLEtBQUssTUFBTSxJQUFJQyxNQUFNO0lBQzFCLE9BQU9EO0FBQ1giLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9oci1mcm9udGVuZC8uL2NvbnRleHQvQXV0aENvbnRleHQudHN4P2ZkZmYiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IGNyZWF0ZUNvbnRleHQsIHVzZUNvbnRleHQsIHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCdcblxudHlwZSBVc2VyID0ge1xuICAgIGlkOiBzdHJpbmdcbiAgICBlbWFpbD86IHN0cmluZ1xuICAgIG5hbWU/OiBzdHJpbmdcbiAgICBwb3NpdGlvbj86IHN0cmluZ1xuICAgIHVzZXJUeXBlPzogc3RyaW5nXG59XG5cbnR5cGUgQXV0aENvbnRleHRWYWx1ZSA9IHtcbiAgICB0b2tlbjogc3RyaW5nIHwgbnVsbFxuICAgIHVzZXI6IFVzZXIgfCBudWxsXG4gICAgYXV0aGVudGljYXRlZDogYm9vbGVhblxuICAgIGxvZ2luOiAodG9rZW46IHN0cmluZywgdXNlcjogVXNlciB8IG51bGwpID0+IHZvaWRcbiAgICBsb2dvdXQ6ICgpID0+IHZvaWRcbn1cblxuY29uc3QgQXV0aENvbnRleHQgPSBjcmVhdGVDb250ZXh0PEF1dGhDb250ZXh0VmFsdWUgfCB1bmRlZmluZWQ+KHVuZGVmaW5lZClcblxuZXhwb3J0IGZ1bmN0aW9uIEF1dGhQcm92aWRlcih7IGNoaWxkcmVuIH06IHsgY2hpbGRyZW46IFJlYWN0LlJlYWN0Tm9kZSB9KSB7XG4gICAgLy8gQWx3YXlzIHN0YXJ0IHdpdGggbnVsbCB0byBlbnN1cmUgc2VydmVyIGFuZCBjbGllbnQgcmVuZGVyIHRoZSBzYW1lXG4gICAgY29uc3QgW3Rva2VuLCBzZXRUb2tlbl0gPSB1c2VTdGF0ZTxzdHJpbmcgfCBudWxsPihudWxsKVxuICAgIGNvbnN0IFt1c2VyLCBzZXRVc2VyXSA9IHVzZVN0YXRlPFVzZXIgfCBudWxsPihudWxsKVxuICAgIGNvbnN0IFttb3VudGVkLCBzZXRNb3VudGVkXSA9IHVzZVN0YXRlKGZhbHNlKVxuXG4gICAgLy8gSHlkcmF0ZSBmcm9tIGxvY2FsU3RvcmFnZSBhZnRlciBtb3VudCAoY2xpZW50LXNpZGUgb25seSlcbiAgICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICBzZXRNb3VudGVkKHRydWUpXG4gICAgICAgIGNvbnN0IHN0b3JlZFRva2VuID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3Rva2VuJylcbiAgICAgICAgY29uc3Qgc3RvcmVkVXNlciA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd1c2VyJylcbiAgICAgICAgaWYgKHN0b3JlZFRva2VuKSBzZXRUb2tlbihzdG9yZWRUb2tlbilcbiAgICAgICAgaWYgKHN0b3JlZFVzZXIpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgc2V0VXNlcihKU09OLnBhcnNlKHN0b3JlZFVzZXIpKVxuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIC8vIEludmFsaWQgSlNPTiwgaWdub3JlXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LCBbXSlcblxuICAgIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgICAgIGlmICghbW91bnRlZCkgcmV0dXJuXG4gICAgICAgIFxuICAgICAgICBmdW5jdGlvbiBvblN0b3JhZ2UoZTogU3RvcmFnZUV2ZW50KSB7XG4gICAgICAgICAgICBpZiAoZS5rZXkgPT09ICd0b2tlbicpIHNldFRva2VuKGUubmV3VmFsdWUpXG4gICAgICAgICAgICBpZiAoZS5rZXkgPT09ICd1c2VyJykgc2V0VXNlcihlLm5ld1ZhbHVlID8gSlNPTi5wYXJzZShlLm5ld1ZhbHVlKSA6IG51bGwpXG4gICAgICAgIH1cblxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignc3RvcmFnZScsIG9uU3RvcmFnZSlcbiAgICAgICAgcmV0dXJuICgpID0+IHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdzdG9yYWdlJywgb25TdG9yYWdlKVxuICAgIH0sIFttb3VudGVkXSlcblxuICAgIGZ1bmN0aW9uIGxvZ2luKHQ6IHN0cmluZywgdTogVXNlciB8IG51bGwpIHtcbiAgICAgICAgc2V0VG9rZW4odClcbiAgICAgICAgc2V0VXNlcih1KVxuICAgICAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCd0b2tlbicsIHQpXG4gICAgICAgICAgICBpZiAodSkgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3VzZXInLCBKU09OLnN0cmluZ2lmeSh1KSlcbiAgICAgICAgICAgIGVsc2UgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ3VzZXInKVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbG9nb3V0KCkge1xuICAgICAgICBzZXRUb2tlbihudWxsKVxuICAgICAgICBzZXRVc2VyKG51bGwpXG4gICAgICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ3Rva2VuJylcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCd1c2VyJylcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IHZhbHVlOiBBdXRoQ29udGV4dFZhbHVlID0ge1xuICAgICAgICB0b2tlbixcbiAgICAgICAgdXNlcixcbiAgICAgICAgYXV0aGVudGljYXRlZDogISF0b2tlbixcbiAgICAgICAgbG9naW4sXG4gICAgICAgIGxvZ291dCxcbiAgICB9XG5cbiAgICByZXR1cm4gPEF1dGhDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXt2YWx1ZX0+e2NoaWxkcmVufTwvQXV0aENvbnRleHQuUHJvdmlkZXI+XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1c2VBdXRoKCkge1xuICAgIGNvbnN0IGN0eCA9IHVzZUNvbnRleHQoQXV0aENvbnRleHQpXG4gICAgaWYgKCFjdHgpIHRocm93IG5ldyBFcnJvcigndXNlQXV0aCBtdXN0IGJlIHVzZWQgd2l0aGluIEF1dGhQcm92aWRlcicpXG4gICAgcmV0dXJuIGN0eFxufVxuIl0sIm5hbWVzIjpbIlJlYWN0IiwiY3JlYXRlQ29udGV4dCIsInVzZUNvbnRleHQiLCJ1c2VFZmZlY3QiLCJ1c2VTdGF0ZSIsIkF1dGhDb250ZXh0IiwidW5kZWZpbmVkIiwiQXV0aFByb3ZpZGVyIiwiY2hpbGRyZW4iLCJ0b2tlbiIsInNldFRva2VuIiwidXNlciIsInNldFVzZXIiLCJtb3VudGVkIiwic2V0TW91bnRlZCIsInN0b3JlZFRva2VuIiwibG9jYWxTdG9yYWdlIiwiZ2V0SXRlbSIsInN0b3JlZFVzZXIiLCJKU09OIiwicGFyc2UiLCJlIiwib25TdG9yYWdlIiwia2V5IiwibmV3VmFsdWUiLCJ3aW5kb3ciLCJhZGRFdmVudExpc3RlbmVyIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsImxvZ2luIiwidCIsInUiLCJzZXRJdGVtIiwic3RyaW5naWZ5IiwicmVtb3ZlSXRlbSIsImxvZ291dCIsInZhbHVlIiwiYXV0aGVudGljYXRlZCIsIlByb3ZpZGVyIiwidXNlQXV0aCIsImN0eCIsIkVycm9yIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./context/AuthContext.tsx\n");

/***/ }),

/***/ "./pages/_app.tsx":
/*!************************!*\
  !*** ./pages/_app.tsx ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ App)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../styles/globals.css */ \"./styles/globals.css\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! next/router */ \"./node_modules/next/router.js\");\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _context_AuthContext__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../context/AuthContext */ \"./context/AuthContext.tsx\");\n\n\n\n\n\nfunction AuthGuard({ children }) {\n    const router = (0,next_router__WEBPACK_IMPORTED_MODULE_3__.useRouter)();\n    const { authenticated } = (0,_context_AuthContext__WEBPACK_IMPORTED_MODULE_4__.useAuth)();\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{\n        const publicPaths = [\n            \"/login\"\n        ];\n        const check = (url)=>{\n            const path = url.split(\"?\")[0];\n            if (!authenticated && !publicPaths.includes(path)) {\n                router.push(\"/login\");\n            }\n        };\n        // initial\n        check(router.pathname);\n        const handler = (url)=>check(url);\n        router.events.on(\"routeChangeStart\", handler);\n        return ()=>router.events.off(\"routeChangeStart\", handler);\n    }, [\n        authenticated,\n        router\n    ]);\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {\n        children: children\n    }, void 0, false);\n}\nfunction App({ Component, pageProps }) {\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_context_AuthContext__WEBPACK_IMPORTED_MODULE_4__.AuthProvider, {\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(AuthGuard, {\n            children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n                ...pageProps\n            }, void 0, false, {\n                fileName: \"/app/pages/_app.tsx\",\n                lineNumber: 34,\n                columnNumber: 17\n            }, this)\n        }, void 0, false, {\n            fileName: \"/app/pages/_app.tsx\",\n            lineNumber: 33,\n            columnNumber: 13\n        }, this)\n    }, void 0, false, {\n        fileName: \"/app/pages/_app.tsx\",\n        lineNumber: 32,\n        columnNumber: 9\n    }, this);\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9fYXBwLnRzeCIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUF3QztBQUNWO0FBRVM7QUFDdUI7QUFFOUQsU0FBU0ssVUFBVSxFQUFFQyxRQUFRLEVBQWlDO0lBQzFELE1BQU1DLFNBQVNMLHNEQUFTQTtJQUN4QixNQUFNLEVBQUVNLGFBQWEsRUFBRSxHQUFHSiw2REFBT0E7SUFFakNILGdEQUFTQSxDQUFDO1FBQ04sTUFBTVEsY0FBYztZQUFDO1NBQVM7UUFDOUIsTUFBTUMsUUFBUSxDQUFDQztZQUNYLE1BQU1DLE9BQU9ELElBQUlFLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUM5QixJQUFJLENBQUNMLGlCQUFpQixDQUFDQyxZQUFZSyxRQUFRLENBQUNGLE9BQU87Z0JBQy9DTCxPQUFPUSxJQUFJLENBQUM7WUFDaEI7UUFDSjtRQUVBLFVBQVU7UUFDVkwsTUFBTUgsT0FBT1MsUUFBUTtRQUNyQixNQUFNQyxVQUFVLENBQUNOLE1BQWdCRCxNQUFNQztRQUN2Q0osT0FBT1csTUFBTSxDQUFDQyxFQUFFLENBQUMsb0JBQW9CRjtRQUNyQyxPQUFPLElBQU1WLE9BQU9XLE1BQU0sQ0FBQ0UsR0FBRyxDQUFDLG9CQUFvQkg7SUFDdkQsR0FBRztRQUFDVDtRQUFlRDtLQUFPO0lBRTFCLHFCQUFPO2tCQUFHRDs7QUFDZDtBQUVlLFNBQVNlLElBQUksRUFBRUMsU0FBUyxFQUFFQyxTQUFTLEVBQVk7SUFDMUQscUJBQ0ksOERBQUNwQiw4REFBWUE7a0JBQ1QsNEVBQUNFO3NCQUNHLDRFQUFDaUI7Z0JBQVcsR0FBR0MsU0FBUzs7Ozs7Ozs7Ozs7Ozs7OztBQUl4QyIsInNvdXJjZXMiOlsid2VicGFjazovL2hyLWZyb250ZW5kLy4vcGFnZXMvX2FwcC50c3g/MmZiZSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0IH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgJy4uL3N0eWxlcy9nbG9iYWxzLmNzcydcbmltcG9ydCB0eXBlIHsgQXBwUHJvcHMgfSBmcm9tICduZXh0L2FwcCdcbmltcG9ydCB7IHVzZVJvdXRlciB9IGZyb20gJ25leHQvcm91dGVyJ1xuaW1wb3J0IHsgQXV0aFByb3ZpZGVyLCB1c2VBdXRoIH0gZnJvbSAnLi4vY29udGV4dC9BdXRoQ29udGV4dCdcblxuZnVuY3Rpb24gQXV0aEd1YXJkKHsgY2hpbGRyZW4gfTogeyBjaGlsZHJlbjogUmVhY3QuUmVhY3ROb2RlIH0pIHtcbiAgICBjb25zdCByb3V0ZXIgPSB1c2VSb3V0ZXIoKVxuICAgIGNvbnN0IHsgYXV0aGVudGljYXRlZCB9ID0gdXNlQXV0aCgpXG5cbiAgICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICBjb25zdCBwdWJsaWNQYXRocyA9IFsnL2xvZ2luJ11cbiAgICAgICAgY29uc3QgY2hlY2sgPSAodXJsOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHBhdGggPSB1cmwuc3BsaXQoJz8nKVswXVxuICAgICAgICAgICAgaWYgKCFhdXRoZW50aWNhdGVkICYmICFwdWJsaWNQYXRocy5pbmNsdWRlcyhwYXRoKSkge1xuICAgICAgICAgICAgICAgIHJvdXRlci5wdXNoKCcvbG9naW4nKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gaW5pdGlhbFxuICAgICAgICBjaGVjayhyb3V0ZXIucGF0aG5hbWUpXG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSAodXJsOiBzdHJpbmcpID0+IGNoZWNrKHVybClcbiAgICAgICAgcm91dGVyLmV2ZW50cy5vbigncm91dGVDaGFuZ2VTdGFydCcsIGhhbmRsZXIpXG4gICAgICAgIHJldHVybiAoKSA9PiByb3V0ZXIuZXZlbnRzLm9mZigncm91dGVDaGFuZ2VTdGFydCcsIGhhbmRsZXIpXG4gICAgfSwgW2F1dGhlbnRpY2F0ZWQsIHJvdXRlcl0pXG5cbiAgICByZXR1cm4gPD57Y2hpbGRyZW59PC8+XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEFwcCh7IENvbXBvbmVudCwgcGFnZVByb3BzIH06IEFwcFByb3BzKSB7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPEF1dGhQcm92aWRlcj5cbiAgICAgICAgICAgIDxBdXRoR3VhcmQ+XG4gICAgICAgICAgICAgICAgPENvbXBvbmVudCB7Li4ucGFnZVByb3BzfSAvPlxuICAgICAgICAgICAgPC9BdXRoR3VhcmQ+XG4gICAgICAgIDwvQXV0aFByb3ZpZGVyPlxuICAgIClcbn1cbiJdLCJuYW1lcyI6WyJSZWFjdCIsInVzZUVmZmVjdCIsInVzZVJvdXRlciIsIkF1dGhQcm92aWRlciIsInVzZUF1dGgiLCJBdXRoR3VhcmQiLCJjaGlsZHJlbiIsInJvdXRlciIsImF1dGhlbnRpY2F0ZWQiLCJwdWJsaWNQYXRocyIsImNoZWNrIiwidXJsIiwicGF0aCIsInNwbGl0IiwiaW5jbHVkZXMiLCJwdXNoIiwicGF0aG5hbWUiLCJoYW5kbGVyIiwiZXZlbnRzIiwib24iLCJvZmYiLCJBcHAiLCJDb21wb25lbnQiLCJwYWdlUHJvcHMiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./pages/_app.tsx\n");

/***/ }),

/***/ "./styles/globals.css":
/*!****************************!*\
  !*** ./styles/globals.css ***!
  \****************************/
/***/ (() => {



/***/ }),

/***/ "next/dist/compiled/next-server/pages.runtime.dev.js":
/*!**********************************************************************!*\
  !*** external "next/dist/compiled/next-server/pages.runtime.dev.js" ***!
  \**********************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/pages.runtime.dev.js");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "react-dom":
/*!****************************!*\
  !*** external "react-dom" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-dom");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("zlib");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/@swc"], () => (__webpack_exec__("./pages/_app.tsx")));
module.exports = __webpack_exports__;

})();