package com.projeto2.nexo.exception;

import org.springframework.http.HttpStatus;

public class BaseException extends RuntimeException {
    private HttpStatus httpStatus;

    private String[] args;
    private TipoExcecaoEnum tipo = TipoExcecaoEnum.ERRO;

    public BaseException(String mensagem){
        this(mensagem, HttpStatus.BAD_REQUEST);
    }

    public BaseException(String message, HttpStatus httpStatus) {
        this(message, httpStatus, "");
    }

    public BaseException(String message, HttpStatus httpStatus, TipoExcecaoEnum tipo, String... args){
        this(message, httpStatus, args);
        this.tipo = tipo;
    }

    public BaseException(String message, HttpStatus httpStatus, String... args) {
        super(message);
        this.httpStatus = httpStatus;
        this.args = args;
    }

    public BaseException(Throwable cause) {
        this(cause, HttpStatus.BAD_REQUEST);
    }

    public BaseException(Throwable cause, HttpStatus httpStatus) {
        super(cause);
        this.httpStatus = httpStatus;
    }

    public HttpStatus getHttpStatus() {
        return this.httpStatus;
    }

    public void setHttpStatus(HttpStatus httpStatus) {
        this.httpStatus = httpStatus;
    }

    public String[] getArgs() {
        return args;
    }

    public void setArgs(String[] args) {
        this.args = args;
    }

    public TipoExcecaoEnum getTipo() {
        return tipo;
    }
}