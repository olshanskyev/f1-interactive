package f1interactive.server.controller;

import f1interactive.server.models.HttpErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.util.AntPathMatcher;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.HandlerMapping;
import org.springframework.web.util.UriComponentsBuilder;

@RestController
@RequestMapping("/vkproxy")
class VKProxyController {

    RestTemplate restTemplate = new RestTemplate();
    private static final Logger logger = LoggerFactory.getLogger(VKProxyController.class);
    private final String VK_API_URL = "https://api.vk.ru";

    private String getPathTail(HttpServletRequest request) {
        String path = (String) request.getAttribute(
                HandlerMapping.PATH_WITHIN_HANDLER_MAPPING_ATTRIBUTE);
        String bestMatchPattern = (String ) request.getAttribute(HandlerMapping.BEST_MATCHING_PATTERN_ATTRIBUTE);

        AntPathMatcher apm = new AntPathMatcher();
        return apm.extractPathWithinPattern(bestMatchPattern, path);
    }

    @GetMapping(value = "/**")
    public ResponseEntity<?> proxyGets(HttpServletRequest request, @RequestParam MultiValueMap<String, String> reqParams) {
        logger.debug("Proxy vk get request");
        String url  = VK_API_URL + "/" + getPathTail(request);
        String requestUrl = UriComponentsBuilder.fromUriString(url)
                .queryParams(reqParams)
                .encode()
                .toUriString();
        try {
            ResponseEntity<Object> response = restTemplate.getForEntity(requestUrl, Object.class);
            return new ResponseEntity<>(response.getBody(), response.getStatusCode());
        } catch (HttpServerErrorException ex) {
            return new ResponseEntity<>(new HttpErrorResponse(ex.getStatusText()), ex.getStatusCode());
        }
    }



}
