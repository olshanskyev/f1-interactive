package f1interactive.server.models;

public record HttpErrorResponse(int code, String msg) {
    public HttpErrorResponse(String msg) {
        this(-1, msg);
    }
}
