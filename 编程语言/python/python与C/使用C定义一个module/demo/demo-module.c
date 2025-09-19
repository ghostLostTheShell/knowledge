#include<Python.h>

//#ifdef __GNUC__
//设置 GCC 动态库的符号为可见的
#define DEMO_MODINIT_FUNC __attribute__((visibility("default"))) PyMODINIT_FUNC
//#else
//#define DEMO_MODINIT_FUNC PyMODINIT_FUNC
//#endif

/**
 * 模块方法
 * @return PyObject* 
 */
static PyObject * add(PyObject *self, PyObject *args){

    PyObject *a1 = PyList_GetItem(args, 0);
    PyObject *a2 = PyList_GetItem(args, 1);

    long v1 = PyLong_AsLong(a1);

    long v2 = PyLong_AsLong(a2);
    
    return PyLong_FromLong(v1 + v2);
}

static PyMethodDef domemodule_functions[] = {
    {"add", (PyCFunction) add, METH_VARARGS, "this function just add"}
};

static struct PyModuleDef _domemodule = {
    PyModuleDef_HEAD_INIT,
    "demo",
    NULL,
    -1,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
};



/**
 * python 导入库时执行的初始化操作 
 * 
 * 初始化函数名的必须是 PyInit_${模块名称}
 */
DEMO_MODINIT_FUNC PyInit_demo(void) {

    PyObject *module;
    module = PyModule_Create(&_domemodule);
    //PyObject *module_dict = PyModule_GetDict(module);//用于添加函数 或 属性

    PyModule_AddStringConstant(module, "__package__", "demo");

    PyModule_AddStringConstant(module, "__doc__", "is a dome");
    
    return module;
}

