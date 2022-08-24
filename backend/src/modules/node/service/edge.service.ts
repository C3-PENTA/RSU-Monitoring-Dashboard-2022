import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ListNodeDto } from '../dto/list-node.dto';
import { Edge } from '../entity/edge.entity';

