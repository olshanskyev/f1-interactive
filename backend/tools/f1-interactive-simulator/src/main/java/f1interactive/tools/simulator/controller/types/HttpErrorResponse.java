package f1interactive.tools.simulator.controller.types;

public class HttpErrorResponse {
    private int code = -1;
    private final String msg;

    public HttpErrorResponse(String msg) {
        this.msg = msg;
    }

    public HttpErrorResponse(String msg, int code) {
        this.code = code;
        this.msg = msg;
    }

    public String getMsg() {
        return msg;
    }

    public int getCode() {
        return code;
    }
}
