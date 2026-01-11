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
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   AuthProvider: () => (/* binding */ AuthProvider),\n/* harmony export */   useAuth: () => (/* binding */ useAuth)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n\n\nconst AuthContext = /*#__PURE__*/ (0,react__WEBPACK_IMPORTED_MODULE_1__.createContext)(undefined);\nfunction AuthProvider({ children }) {\n    // Always start with null to ensure server and client render the same\n    const [token, setToken] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);\n    const [user, setUser] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);\n    const [mounted, setMounted] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);\n    // Hydrate from localStorage after mount (client-side only)\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{\n        setMounted(true);\n        const storedToken = localStorage.getItem(\"token\");\n        const storedUser = localStorage.getItem(\"user\");\n        if (storedToken) setToken(storedToken);\n        if (storedUser) {\n            try {\n                setUser(JSON.parse(storedUser));\n            } catch (e) {\n            // Invalid JSON, ignore\n            }\n        }\n    }, []);\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{\n        if (!mounted) return;\n        function onStorage(e) {\n            if (e.key === \"token\") setToken(e.newValue);\n            if (e.key === \"user\") setUser(e.newValue ? JSON.parse(e.newValue) : null);\n        }\n        window.addEventListener(\"storage\", onStorage);\n        return ()=>window.removeEventListener(\"storage\", onStorage);\n    }, [\n        mounted\n    ]);\n    function login(t, u) {\n        setToken(t);\n        setUser(u);\n        if (false) {}\n    }\n    function logout() {\n        setToken(null);\n        setUser(null);\n        if (false) {}\n    }\n    const value = {\n        token,\n        user,\n        authenticated: !!token,\n        login,\n        logout\n    };\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(AuthContext.Provider, {\n        value: value,\n        children: children\n    }, void 0, false, {\n        fileName: \"/app/context/AuthContext.tsx\",\n        lineNumber: 80,\n        columnNumber: 12\n    }, this);\n}\nfunction useAuth() {\n    const ctx = (0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(AuthContext);\n    if (!ctx) throw new Error(\"useAuth must be used within AuthProvider\");\n    return ctx;\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9jb250ZXh0L0F1dGhDb250ZXh0LnRzeCIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQTZFO0FBaUI3RSxNQUFNSyw0QkFBY0osb0RBQWFBLENBQStCSztBQUV6RCxTQUFTQyxhQUFhLEVBQUVDLFFBQVEsRUFBaUM7SUFDcEUscUVBQXFFO0lBQ3JFLE1BQU0sQ0FBQ0MsT0FBT0MsU0FBUyxHQUFHTiwrQ0FBUUEsQ0FBZ0I7SUFDbEQsTUFBTSxDQUFDTyxNQUFNQyxRQUFRLEdBQUdSLCtDQUFRQSxDQUFjO0lBQzlDLE1BQU0sQ0FBQ1MsU0FBU0MsV0FBVyxHQUFHViwrQ0FBUUEsQ0FBQztJQUV2QywyREFBMkQ7SUFDM0RELGdEQUFTQSxDQUFDO1FBQ05XLFdBQVc7UUFDWCxNQUFNQyxjQUFjQyxhQUFhQyxPQUFPLENBQUM7UUFDekMsTUFBTUMsYUFBYUYsYUFBYUMsT0FBTyxDQUFDO1FBQ3hDLElBQUlGLGFBQWFMLFNBQVNLO1FBQzFCLElBQUlHLFlBQVk7WUFDWixJQUFJO2dCQUNBTixRQUFRTyxLQUFLQyxLQUFLLENBQUNGO1lBQ3ZCLEVBQUUsT0FBT0csR0FBRztZQUNSLHVCQUF1QjtZQUMzQjtRQUNKO0lBQ0osR0FBRyxFQUFFO0lBRUxsQixnREFBU0EsQ0FBQztRQUNOLElBQUksQ0FBQ1UsU0FBUztRQUVkLFNBQVNTLFVBQVVELENBQWU7WUFDOUIsSUFBSUEsRUFBRUUsR0FBRyxLQUFLLFNBQVNiLFNBQVNXLEVBQUVHLFFBQVE7WUFDMUMsSUFBSUgsRUFBRUUsR0FBRyxLQUFLLFFBQVFYLFFBQVFTLEVBQUVHLFFBQVEsR0FBR0wsS0FBS0MsS0FBSyxDQUFDQyxFQUFFRyxRQUFRLElBQUk7UUFDeEU7UUFFQUMsT0FBT0MsZ0JBQWdCLENBQUMsV0FBV0o7UUFDbkMsT0FBTyxJQUFNRyxPQUFPRSxtQkFBbUIsQ0FBQyxXQUFXTDtJQUN2RCxHQUFHO1FBQUNUO0tBQVE7SUFFWixTQUFTZSxNQUFNQyxDQUFTLEVBQUVDLENBQWM7UUFDcENwQixTQUFTbUI7UUFDVGpCLFFBQVFrQjtRQUNSLElBQUksS0FBa0IsRUFBYSxFQUlsQztJQUNMO0lBRUEsU0FBU0k7UUFDTHhCLFNBQVM7UUFDVEUsUUFBUTtRQUNSLElBQUksS0FBa0IsRUFBYSxFQUdsQztJQUNMO0lBRUEsTUFBTXVCLFFBQTBCO1FBQzVCMUI7UUFDQUU7UUFDQXlCLGVBQWUsQ0FBQyxDQUFDM0I7UUFDakJtQjtRQUNBTTtJQUNKO0lBRUEscUJBQU8sOERBQUM3QixZQUFZZ0MsUUFBUTtRQUFDRixPQUFPQTtrQkFBUTNCOzs7Ozs7QUFDaEQ7QUFFTyxTQUFTOEI7SUFDWixNQUFNQyxNQUFNckMsaURBQVVBLENBQUNHO0lBQ3ZCLElBQUksQ0FBQ2tDLEtBQUssTUFBTSxJQUFJQyxNQUFNO0lBQzFCLE9BQU9EO0FBQ1giLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9oci1mcm9udGVuZC8uL2NvbnRleHQvQXV0aENvbnRleHQudHN4P2ZkZmYiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IGNyZWF0ZUNvbnRleHQsIHVzZUNvbnRleHQsIHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCdcblxudHlwZSBVc2VyID0ge1xuICAgIGlkOiBzdHJpbmdcbiAgICBlbWFpbD86IHN0cmluZ1xuICAgIG5hbWU/OiBzdHJpbmdcbiAgICBwb3NpdGlvbj86IHN0cmluZ1xufVxuXG50eXBlIEF1dGhDb250ZXh0VmFsdWUgPSB7XG4gICAgdG9rZW46IHN0cmluZyB8IG51bGxcbiAgICB1c2VyOiBVc2VyIHwgbnVsbFxuICAgIGF1dGhlbnRpY2F0ZWQ6IGJvb2xlYW5cbiAgICBsb2dpbjogKHRva2VuOiBzdHJpbmcsIHVzZXI6IFVzZXIgfCBudWxsKSA9PiB2b2lkXG4gICAgbG9nb3V0OiAoKSA9PiB2b2lkXG59XG5cbmNvbnN0IEF1dGhDb250ZXh0ID0gY3JlYXRlQ29udGV4dDxBdXRoQ29udGV4dFZhbHVlIHwgdW5kZWZpbmVkPih1bmRlZmluZWQpXG5cbmV4cG9ydCBmdW5jdGlvbiBBdXRoUHJvdmlkZXIoeyBjaGlsZHJlbiB9OiB7IGNoaWxkcmVuOiBSZWFjdC5SZWFjdE5vZGUgfSkge1xuICAgIC8vIEFsd2F5cyBzdGFydCB3aXRoIG51bGwgdG8gZW5zdXJlIHNlcnZlciBhbmQgY2xpZW50IHJlbmRlciB0aGUgc2FtZVxuICAgIGNvbnN0IFt0b2tlbiwgc2V0VG9rZW5dID0gdXNlU3RhdGU8c3RyaW5nIHwgbnVsbD4obnVsbClcbiAgICBjb25zdCBbdXNlciwgc2V0VXNlcl0gPSB1c2VTdGF0ZTxVc2VyIHwgbnVsbD4obnVsbClcbiAgICBjb25zdCBbbW91bnRlZCwgc2V0TW91bnRlZF0gPSB1c2VTdGF0ZShmYWxzZSlcblxuICAgIC8vIEh5ZHJhdGUgZnJvbSBsb2NhbFN0b3JhZ2UgYWZ0ZXIgbW91bnQgKGNsaWVudC1zaWRlIG9ubHkpXG4gICAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICAgICAgc2V0TW91bnRlZCh0cnVlKVxuICAgICAgICBjb25zdCBzdG9yZWRUb2tlbiA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCd0b2tlbicpXG4gICAgICAgIGNvbnN0IHN0b3JlZFVzZXIgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndXNlcicpXG4gICAgICAgIGlmIChzdG9yZWRUb2tlbikgc2V0VG9rZW4oc3RvcmVkVG9rZW4pXG4gICAgICAgIGlmIChzdG9yZWRVc2VyKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHNldFVzZXIoSlNPTi5wYXJzZShzdG9yZWRVc2VyKSlcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAvLyBJbnZhbGlkIEpTT04sIGlnbm9yZVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSwgW10pXG5cbiAgICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICBpZiAoIW1vdW50ZWQpIHJldHVyblxuICAgICAgICBcbiAgICAgICAgZnVuY3Rpb24gb25TdG9yYWdlKGU6IFN0b3JhZ2VFdmVudCkge1xuICAgICAgICAgICAgaWYgKGUua2V5ID09PSAndG9rZW4nKSBzZXRUb2tlbihlLm5ld1ZhbHVlKVxuICAgICAgICAgICAgaWYgKGUua2V5ID09PSAndXNlcicpIHNldFVzZXIoZS5uZXdWYWx1ZSA/IEpTT04ucGFyc2UoZS5uZXdWYWx1ZSkgOiBudWxsKVxuICAgICAgICB9XG5cbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3N0b3JhZ2UnLCBvblN0b3JhZ2UpXG4gICAgICAgIHJldHVybiAoKSA9PiB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignc3RvcmFnZScsIG9uU3RvcmFnZSlcbiAgICB9LCBbbW91bnRlZF0pXG5cbiAgICBmdW5jdGlvbiBsb2dpbih0OiBzdHJpbmcsIHU6IFVzZXIgfCBudWxsKSB7XG4gICAgICAgIHNldFRva2VuKHQpXG4gICAgICAgIHNldFVzZXIodSlcbiAgICAgICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgndG9rZW4nLCB0KVxuICAgICAgICAgICAgaWYgKHUpIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCd1c2VyJywgSlNPTi5zdHJpbmdpZnkodSkpXG4gICAgICAgICAgICBlbHNlIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCd1c2VyJylcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxvZ291dCgpIHtcbiAgICAgICAgc2V0VG9rZW4obnVsbClcbiAgICAgICAgc2V0VXNlcihudWxsKVxuICAgICAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCd0b2tlbicpXG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgndXNlcicpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCB2YWx1ZTogQXV0aENvbnRleHRWYWx1ZSA9IHtcbiAgICAgICAgdG9rZW4sXG4gICAgICAgIHVzZXIsXG4gICAgICAgIGF1dGhlbnRpY2F0ZWQ6ICEhdG9rZW4sXG4gICAgICAgIGxvZ2luLFxuICAgICAgICBsb2dvdXQsXG4gICAgfVxuXG4gICAgcmV0dXJuIDxBdXRoQ29udGV4dC5Qcm92aWRlciB2YWx1ZT17dmFsdWV9PntjaGlsZHJlbn08L0F1dGhDb250ZXh0LlByb3ZpZGVyPlxufVxuXG5leHBvcnQgZnVuY3Rpb24gdXNlQXV0aCgpIHtcbiAgICBjb25zdCBjdHggPSB1c2VDb250ZXh0KEF1dGhDb250ZXh0KVxuICAgIGlmICghY3R4KSB0aHJvdyBuZXcgRXJyb3IoJ3VzZUF1dGggbXVzdCBiZSB1c2VkIHdpdGhpbiBBdXRoUHJvdmlkZXInKVxuICAgIHJldHVybiBjdHhcbn1cbiJdLCJuYW1lcyI6WyJSZWFjdCIsImNyZWF0ZUNvbnRleHQiLCJ1c2VDb250ZXh0IiwidXNlRWZmZWN0IiwidXNlU3RhdGUiLCJBdXRoQ29udGV4dCIsInVuZGVmaW5lZCIsIkF1dGhQcm92aWRlciIsImNoaWxkcmVuIiwidG9rZW4iLCJzZXRUb2tlbiIsInVzZXIiLCJzZXRVc2VyIiwibW91bnRlZCIsInNldE1vdW50ZWQiLCJzdG9yZWRUb2tlbiIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJzdG9yZWRVc2VyIiwiSlNPTiIsInBhcnNlIiwiZSIsIm9uU3RvcmFnZSIsImtleSIsIm5ld1ZhbHVlIiwid2luZG93IiwiYWRkRXZlbnRMaXN0ZW5lciIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJsb2dpbiIsInQiLCJ1Iiwic2V0SXRlbSIsInN0cmluZ2lmeSIsInJlbW92ZUl0ZW0iLCJsb2dvdXQiLCJ2YWx1ZSIsImF1dGhlbnRpY2F0ZWQiLCJQcm92aWRlciIsInVzZUF1dGgiLCJjdHgiLCJFcnJvciJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./context/AuthContext.tsx\n");

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