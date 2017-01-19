FROM arizonatribe/centossupervisor
MAINTAINER David Nunez <arizonatribe@gmail.com>

ENV APP_NAME wordgenerator
ENV APP_WORKING_DIR /var/lib/${APP_NAME}
EXPOSE 5000

WORKDIR ${APP_WORKING_DIR}
CMD ["/usr/bin/start"]
VOLUME ["/data"]

# Python dependencies not already in the base image
RUN pip install flask

# Overlay, containing yum.repos.d, supervisord configs and other shell scripts
COPY docker /

# Copy the src files into the docker image
COPY src ${APP_WORKING_DIR}/src
